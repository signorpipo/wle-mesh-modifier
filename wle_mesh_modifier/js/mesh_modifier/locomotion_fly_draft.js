WL.registerComponent('locomotion-fly-draft', {
    _myMaxSpeed: { type: WL.Type.Float, default: 2 },
    _myMinHeight: { type: WL.Type.Float, default: 0 },
    _myMinAngleToFly: { type: WL.Type.Float, default: 30 },
    _myMaxRotationSpeed: { type: WL.Type.Float, default: 100 },
    _myIsSnapTurn: { type: WL.Type.Bool, default: true },
    _mySnapTurnAngle: { type: WL.Type.Float, default: 45 },
    _myPlayerObject: { type: WL.Type.Object },
    _myNonVRCameraObject: { type: WL.Type.Object },
    _myNonVRHeadObject: { type: WL.Type.Object },
    _myHeadObject: { type: WL.Type.Object },
    _myDirectionReferenceObject: { type: WL.Type.Object },
}, {
    init: function () {
    },
    start() {
        this._myCurrentHeadObject = this._myNonVRHeadObject;
        this._myCurrentNonVRCameraObject = this._myNonVRCameraObject;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._mySessionChangeResyncHeadTransform = null;

        this._myBlurRecoverHeadTransform = null;
        this._myBlurRecoverPlayerUp = null;

        this._myDelaySessionChangeResyncCounter = 0;
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer = new PP.Timer(5, false);
        this._myVisibilityWentHidden = false;
        this._mySessionActive = false;

        this._myStartForward = null;
        this._myStartUp = null;
        this._myStartRight = null;
        this._myStickIdleCount = 0;

        this._myLastValidFlatForward = null;
        this._myLastValidFlatRight = null;

        this._myRemoveUp = true;
        this._myRemoveXTilt = true;
        this._myPreventHeadUpsideDown = true;

        this._myPreTiltMatrix = PP.mat4_create();
        this._myTiltMatrix = PP.mat4_create();

        this._myWorldUp = [0, 1, 0];

        this._mySnapDone = false;
        this._myIsOnGround = false;
        this._myIsFlyingForward = false;
        this._myIsFlyingRight = false;
    },
    update(dt) {
        /* this._myTiltMatrix.mat4_setPosition(this._myDirectionReferenceObject.pp_getPosition());
        let debugTransformParams = new PP.DebugTransformParams();
        debugTransformParams.myTransform = this._myTiltMatrix;
        PP.myDebugManager.draw(debugTransformParams);

        this._myPreTiltMatrix.mat4_setPosition(this._myDirectionReferenceObject.pp_getPosition().vec3_add([0, 0.15, 0]));
        debugTransformParams = new PP.DebugTransformParams();
        debugTransformParams.myTransform = this._myPreTiltMatrix;
        PP.myDebugManager.draw(debugTransformParams); */

        if (this._myDelaySessionChangeResyncCounter > 0) {
            this._myDelaySessionChangeResyncCounter--;
            if (this._myDelaySessionChangeResyncCounter == 0) {
                this._sessionChangeResync();
            }
        }

        if (this._myDelayBlurEndResyncCounter > 0 && !this._myDelayBlurEndResyncTimer.isRunning()) {
            this._myDelayBlurEndResyncCounter--;
            if (this._myDelayBlurEndResyncCounter == 0) {
                this._blurEndResync();
            }
        }

        if (this._myDelayBlurEndResyncTimer.isRunning()) {
            if (this._myDelayBlurEndResyncCounter > 0) {
                this._myDelayBlurEndResyncCounter--;
            } else {
                this._myDelayBlurEndResyncTimer.update(dt);
                if (this._myDelayBlurEndResyncTimer.isDone()) {
                    this._blurEndResync();
                }
            }
        }

        let skipLocomotion = this._myDelaySessionChangeResyncCounter > 0 || this._myDelayBlurEndResyncCounter > 0 || this._myDelayBlurEndResyncTimer.isRunning();
        if (!skipLocomotion) {
            let positionChanged = false;
            let rotationChanged = false;

            let headMovement = [0, 0, 0];

            {
                let axes = PP.myLeftGamepad.getAxesInfo().getAxes();
                let minIntensityThreshold = 0.1;
                if (axes.vec2_length() > minIntensityThreshold && PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
                    this._myStickIdleCount = 2;
                    let direction = this._convertStickToWorldFlyDirection(axes, this._myDirectionReferenceObject, this._myRemoveUp);
                    if (direction.vec3_length() > 0.001) {
                        direction.vec3_normalize(direction);

                        this._myIsFlying = direction.vec3_componentAlongAxis(this._myWorldUp).vec3_length() > 0.0001;

                        let movementIntensity = axes.vec2_length();
                        let speed = Math.pp_lerp(0, this._myMaxSpeed, movementIntensity);

                        direction.vec3_scale(speed * dt, headMovement);

                        positionChanged = true;
                    }
                } else {
                    if (this._myStickIdleCount > 0) {
                        this._myStickIdleCount--;
                        if (this._myStickIdleCount == 0) {
                            this._myStartForward = null;
                            this._myStartUp = null;
                            this._myStartRight = null;

                            this._myLastValidFlatForward = null;
                            this._myLastValidFlatRight = null;

                            this._myIsFlying = false;
                            this._myIsFlyingForward = false;
                            this._myIsFlyingRight = false;
                        }
                    }
                }
            }

            if (positionChanged) {
                this._moveHead(headMovement);
            }

            let headRotation = PP.quat_create();
            {
                let axes = PP.myRightGamepad.getAxesInfo().getAxes();
                if (!this._myIsSnapTurn) {
                    let minIntensityThreshold = 0.1;
                    if (Math.abs(axes[0]) > minIntensityThreshold && PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
                        let axis = this._myPlayerObject.pp_getUp();

                        let rotationIntensity = -axes[0];
                        let speed = Math.pp_lerp(0, this._myMaxRotationSpeed, rotationIntensity);

                        headRotation.quat_fromAxis(speed * dt, axis);

                        rotationChanged = true;
                    }
                } else {
                    if (this._mySnapDone) {
                        let stickThreshold = 0.4;
                        if (Math.abs(axes[0]) < stickThreshold) {
                            this._mySnapDone = false;
                        }
                    } else {
                        let stickThreshold = 0.5;
                        if (Math.abs(axes[0]) > stickThreshold && PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
                            let axis = this._myPlayerObject.pp_getUp();

                            let rotation = -Math.pp_sign(axes[0]) * this._mySnapTurnAngle;
                            headRotation.quat_fromAxis(rotation, axis);

                            rotationChanged = true;
                            this._mySnapDone = true;
                        }
                    }
                }
            }

            if (rotationChanged) {
                this._rotateHead(headRotation);
            }

            let playerPosition = this._myPlayerObject.pp_getPosition();
            let heightFromFloor = playerPosition.vec3_valueAlongAxis(this._myWorldUp);
            if (heightFromFloor <= this._myMinHeight + 0.01) {
                let heightDisplacement = this._myMinHeight - heightFromFloor;
                this._myPlayerObject.pp_translateAxis(heightDisplacement, this._myWorldUp);
                this._myIsOnGround = true;
                this._myIsFlying = false;
                this._myIsFlyingForward = false;
                this._myIsFlyingRight = false;
            } else {
                this._myIsOnGround = false;
            }

        }
    },
    _moveHead(movement) {
        this._myPlayerObject.pp_translate(movement);
    },
    _rotateHead(rotation) {
        let currentHeadPosition = this._myCurrentHeadObject.pp_getPosition();

        this._myPlayerObject.pp_rotateAroundQuat(rotation, this._myCurrentHeadObject.pp_getPosition());

        let newHeadPosition = this._myCurrentHeadObject.pp_getPosition();
        let adjustmentMovement = currentHeadPosition.vec3_sub(newHeadPosition);

        this._moveHead(adjustmentMovement);
    },
    _teleportHead(teleportPosition, teleportRotation) {
        this._teleportHeadPosition(teleportPosition);

        let currentHeadRotation = this._myCurrentHeadObject.pp_getRotationQuat();
        let teleportRotationToPerform = currentHeadRotation.quat_rotationToQuat(teleportRotation);
        this._rotateHead(teleportRotationToPerform);
    },
    _teleportHeadPosition(teleportPosition) {
        let currentHeadPosition = this._myCurrentHeadObject.pp_getPosition();
        let teleportMovementToPerform = teleportPosition.vec3_sub(currentHeadPosition);
        this._moveHead(teleportMovementToPerform);
    },
    _convertStickToWorldDirection(stickAxes, conversionObject, removeUp) {
        let playerUp = this._myPlayerObject.pp_getUp();

        let up = conversionObject.pp_getUp();
        let forward = conversionObject.pp_getForward();
        let right = conversionObject.pp_getRight();

        if (removeUp) {
            /* if (forward.vec3_angle(playerUp) < 30) {
                let fixedForward = up.vec3_negate();
                if (!fixedForward.vec3_removeComponentAlongAxis(playerUp).vec3_isConcordant(forward)) {
                    fixedForward.vec3_negate(forward);
                } else {
                    forward.pp_copy(fixedForward);
                }
            } else if (forward.vec3_angle(playerUp.vec3_negate()) < 30) {
                
                let fixedForward = up.pp_clone();
                if (!fixedForward.vec3_removeComponentAlongAxis(playerUp).vec3_isConcordant(forward)) {
                    fixedForward.vec3_negate(forward);
                } else {
                    forward.pp_copy(fixedForward);
                }
            } */

            /* 
            if (right.vec3_angle(playerUp) < 30) {
                let fixedRight = up.vec3_negate();
                if (!fixedRight.vec3_removeComponentAlongAxis(playerUp).vec3_isConcordant(right)) {
                    fixedRight.vec3_negate(right);
                } else {
                    right.pp_copy(fixedRight);
                }
            } else if (right.vec3_angle(playerUp.vec3_negate()) < 30) {
                let fixedRight = up.pp_clone();
                if (!fixedRight.vec3_removeComponentAlongAxis(playerUp).vec3_isConcordant(right)) {
                    fixedRight.vec3_negate(right);
                } else {
                    right.pp_copy(fixedRight);
                }
            } */

            let minAngle = 10;
            if (this._myLastValidFlatForward && (forward.vec3_angle(playerUp) < minAngle || forward.vec3_angle(playerUp.vec3_negate()) < minAngle)) {
                if (forward.vec3_isConcordant(this._myLastValidFlatForward)) {
                    forward.pp_copy(this._myLastValidFlatForward);
                } else {
                    this._myLastValidFlatForward.vec3_negate(forward);
                }
            }

            if (this._myLastValidFlatRight && (right.vec3_angle(playerUp) < minAngle || right.vec3_angle(playerUp.vec3_negate()) < minAngle)) {
                if (right.vec3_isConcordant(this._myLastValidFlatRight)) {
                    right.pp_copy(this._myLastValidFlatRight);
                } else {
                    this._myLastValidFlatRight.vec3_negate(right);
                }
            }

            forward.vec3_removeComponentAlongAxis(playerUp, forward);
            right.vec3_removeComponentAlongAxis(playerUp, right);

            right.vec3_cross(forward, up);
            forward.vec3_cross(up, right);

            if (this._myStartForward != null) {
                if (this._myStartUp.vec3_isConcordant(playerUp) != up.vec3_isConcordant(playerUp)) {
                    if (!this._myStartForward.vec3_isConcordant(forward)) {
                        forward.vec3_negate(forward);
                    } else {
                        right.vec3_negate(right);
                    }

                    up.vec3_negate(up);
                }
            }
        }

        forward.vec3_normalize(forward);
        right.vec3_normalize(right);
        up.vec3_normalize(up);

        this._myLastValidFlatForward = forward.pp_clone();
        this._myLastValidFlatRight = right.pp_clone();

        if (this._myStartForward == null) {
            this._myStartForward = forward.pp_clone();
            this._myStartUp = up.pp_clone();
            this._myStartRight = right.pp_clone();
        }

        /* let debugArrowParamsForward = new PP.DebugArrowParams();
        debugArrowParamsForward.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsForward.myDirection = forward;
        debugArrowParamsForward.myLength = 0.2;
        debugArrowParamsForward.myColor = [0, 0, 1, 1];
        PP.myDebugManager.draw(debugArrowParamsForward);

        let debugArrowParamsStartForward = new PP.DebugArrowParams();
        debugArrowParamsStartForward.myStart = this._myDirectionReferenceObject.pp_getPosition();
        //debugArrowParamsStartForward.myDirection = conversionObject.pp_getForward().vec3_removeComponentAlongAxis(playerUp).vec3_normalize();
        debugArrowParamsStartForward.myDirection = this._myStartForward;
        debugArrowParamsStartForward.myLength = 0.2;
        debugArrowParamsStartForward.myColor = [0, 0, 0.5, 1];
        PP.myDebugManager.draw(debugArrowParamsStartForward);

        let debugArrowParamsRight = new PP.DebugArrowParams();
        debugArrowParamsRight.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsRight.myDirection = right;
        debugArrowParamsRight.myLength = 0.2;
        debugArrowParamsRight.myColor = [1, 0, 0, 1];
        PP.myDebugManager.draw(debugArrowParamsRight);

        let debugArrowParamsUp = new PP.DebugArrowParams();
        debugArrowParamsUp.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsUp.myDirection = up;
        debugArrowParamsUp.myLength = 0.2;
        debugArrowParamsUp.myColor = [0, 1, 0, 1];
        PP.myDebugManager.draw(debugArrowParamsUp); */

        let direction = right.vec3_scale(stickAxes[0]).vec3_add(forward.vec3_scale(stickAxes[1]));

        if (removeUp) {
            direction.vec3_removeComponentAlongAxis(playerUp, direction);
        }

        return direction;
    },
    _convertStickToWorldFlyDirection(stickAxes, conversionObject) {
        let playerUp = this._myPlayerObject.pp_getUp();

        let up = conversionObject.pp_getUp();
        let forward = conversionObject.pp_getForward();
        let right = conversionObject.pp_getRight();

        let angleForwardWithWorldUp = forward.vec3_angle(this._myWorldUp);
        removeForwardUp = !this._myIsFlyingForward && (angleForwardWithWorldUp >= 90 - this._myMinAngleToFly && angleForwardWithWorldUp <= 90 + this._myMinAngleToFly);

        this._myIsFlyingForward = !removeForwardUp;

        let angleRightWithWorldUp = right.vec3_angle(this._myWorldUp);
        removeRightUp = !this._myIsFlyingRight && (angleRightWithWorldUp >= 90 - this._myMinAngleToFly && angleRightWithWorldUp <= 90 + this._myMinAngleToFly);

        this._myIsFlyingRight = !removeRightUp;

        if (removeForwardUp || removeRightUp) {
            if (removeForwardUp) {
                let minAngle = 10;
                if (this._myLastValidFlatForward && (forward.vec3_angle(playerUp) < minAngle || forward.vec3_angle(playerUp.vec3_negate()) < minAngle)) {
                    if (forward.vec3_isConcordant(this._myLastValidFlatForward)) {
                        forward.pp_copy(this._myLastValidFlatForward);
                    } else {
                        this._myLastValidFlatForward.vec3_negate(forward);
                    }
                }
            }

            if (removeRightUp) {
                let minAngle = 10;
                if (this._myLastValidFlatRight && (right.vec3_angle(playerUp) < minAngle || right.vec3_angle(playerUp.vec3_negate()) < minAngle)) {
                    if (right.vec3_isConcordant(this._myLastValidFlatRight)) {
                        right.pp_copy(this._myLastValidFlatRight);
                    } else {
                        this._myLastValidFlatRight.vec3_negate(right);
                    }
                }
            }

            if (removeForwardUp) {
                forward.vec3_removeComponentAlongAxis(playerUp, forward);
            }

            if (removeRightUp) {
                right.vec3_removeComponentAlongAxis(playerUp, right);
            }

            if (this._myStartForward != null) {
                if (this._myStartUp.vec3_isConcordant(playerUp) != up.vec3_isConcordant(playerUp)) {
                    if (!this._myStartForward.vec3_isConcordant(forward) && removeForwardUp) {
                        forward.vec3_negate(forward); // non negare ma ruotare sul player up
                    }

                    if (!this._myStartRight.vec3_isConcordant(right) && removeRightUp) {
                        right.vec3_negate(right); // non negare ma ruotare sul player up
                    }

                    up.vec3_negate(up);
                }
            }
        }

        forward.vec3_normalize(forward);
        right.vec3_normalize(right);
        up.vec3_normalize(up);

        {
            let minAngle = 10;
            if (forward.vec3_angle(playerUp) > minAngle && forward.vec3_angle(playerUp.vec3_negate()) > minAngle) {
                this._myLastValidFlatForward = forward;
            }

            if (right.vec3_angle(playerUp) > minAngle && right.vec3_angle(playerUp.vec3_negate()) > minAngle) {
                this._myLastValidFlatRight = right;
            }
        }

        if (this._myStartForward == null) {
            this._myStartForward = forward.pp_clone();
            this._myStartUp = up.pp_clone();
            this._myStartRight = right.pp_clone();
        }

        /* let debugArrowParamsForward = new PP.DebugArrowParams();
        debugArrowParamsForward.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsForward.myDirection = forward;
        debugArrowParamsForward.myLength = 0.2;
        debugArrowParamsForward.myColor = [0, 0, 1, 1];
        PP.myDebugManager.draw(debugArrowParamsForward);
        
        let debugArrowParamsStartForward = new PP.DebugArrowParams();
        debugArrowParamsStartForward.myStart = this._myDirectionReferenceObject.pp_getPosition();
        //debugArrowParamsStartForward.myDirection = conversionObject.pp_getForward().vec3_removeComponentAlongAxis(playerUp).vec3_normalize();
        debugArrowParamsStartForward.myDirection = this._myStartForward;
        debugArrowParamsStartForward.myLength = 0.2;
        debugArrowParamsStartForward.myColor = [0, 0, 0.5, 1];
        PP.myDebugManager.draw(debugArrowParamsStartForward);
        
        let debugArrowParamsRight = new PP.DebugArrowParams();
        debugArrowParamsRight.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsRight.myDirection = right;
        debugArrowParamsRight.myLength = 0.2;
        debugArrowParamsRight.myColor = [1, 0, 0, 1];
        PP.myDebugManager.draw(debugArrowParamsRight);
        
        let debugArrowParamsUp = new PP.DebugArrowParams();
        debugArrowParamsUp.myStart = this._myDirectionReferenceObject.pp_getPosition();
        debugArrowParamsUp.myDirection = up;
        debugArrowParamsUp.myLength = 0.2;
        debugArrowParamsUp.myColor = [0, 1, 0, 1];
        PP.myDebugManager.draw(debugArrowParamsUp); */

        let direction = right.vec3_scale(stickAxes[0]).vec3_add(forward.vec3_scale(stickAxes[1]));

        if (removeForwardUp && removeRightUp) {
            direction.vec3_removeComponentAlongAxis(playerUp, direction);
        }

        return direction;
    },
    _onXRSessionStart(session) {
        this._myBlurRecoverHeadTransform = null;
        this._myBlurRecoverPlayerUp = null;
        this._myVisibilityWentHidden = false;

        this._myDelaySessionChangeResyncCounter = 0;
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();

        session.requestReferenceSpace(WebXR.refSpace).then(function (referenceSpace) {
            if (referenceSpace.addEventListener != null) {
                referenceSpace.addEventListener("reset", this._onViewReset.bind(this));
            }
        }.bind(this));

        session.addEventListener('visibilitychange', function (event) {
            if (event.session.visibilityState != "visible") {
                this._onXRSessionBlurStart(event.session);
            } else {
                this._onXRSessionBlurEnd(event.session);
            }
        }.bind(this));

        if (this._myDelaySessionChangeResyncCounter == 0) {
            let previousHeadObject = this._myCurrentHeadObject;
            this._mySessionChangeResyncHeadTransform = previousHeadObject.pp_getTransformQuat();
        }

        this._myDelaySessionChangeResyncCounter = 2;

        this._mySessionActive = true;

        this._myCurrentHeadObject = this._myHeadObject;
        this._myCurrentNonVRCameraObject = null;

        //console.error("session start");
    },
    _onXRSessionEnd(session) {
        if (this._myDelaySessionChangeResyncCounter == 0) {
            let previousHeadTransform = this._myCurrentHeadObject.pp_getTransformQuat();

            if (this._myBlurRecoverHeadTransform != null) {
                let playerUp = this._myPlayerObject.pp_getUp();
                if (playerUp.vec3_angle(this._myBlurRecoverPlayerUp) == 0) {
                    previousHeadTransform = this._myBlurRecoverHeadTransform;
                }
            }

            this._mySessionChangeResyncHeadTransform = previousHeadTransform;
        }

        this._myDelaySessionChangeResyncCounter = 2;

        this._myBlurRecoverHeadTransform = null;
        this._myBlurRecoverPlayerUp = null;
        this._myVisibilityWentHidden = false;

        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();

        this._mySessionActive = false;

        this._myCurrentHeadObject = this._myNonVRHeadObject;
        this._myCurrentNonVRCameraObject = this._myNonVRCameraObject;

        //console.error("session end");
    },
    _onXRSessionBlurStart(session) {
        if (this._myBlurRecoverHeadTransform == null && this._mySessionActive) {
            if (this._myDelaySessionChangeResyncCounter > 0) {
                this._myBlurRecoverHeadTransform = this._mySessionChangeResyncHeadTransform;
                this._myBlurRecoverPlayerUp = this._myPlayerObject.pp_getUp();
            } else {
                this._myBlurRecoverHeadTransform = this._myCurrentHeadObject.pp_getTransformQuat();
                this._myBlurRecoverPlayerUp = this._myPlayerObject.pp_getUp();
            }
        } else if (!this._mySessionActive) {
            this._myBlurRecoverHeadTransform = null;
            this._myBlurRecoverPlayerUp = null;
        }

        this._myVisibilityWentHidden = this._myVisibilityWentHidden || session.visibilityState == "hidden";

        //console.error("blur start", session.visibilityState);
    },
    _onXRSessionBlurEnd(session) {
        if (this._myDelaySessionChangeResyncCounter == 0) {
            if (this._myBlurRecoverHeadTransform != null && this._mySessionActive) {
                let playerUp = this._myPlayerObject.pp_getUp();
                if (playerUp.vec3_angle(this._myBlurRecoverPlayerUp) == 0) {
                    this._myDelayBlurEndResyncCounter = 2;
                    if (this._myVisibilityWentHidden) {
                        //this._myDelayBlurEndResyncTimer.start();
                    }
                } else {
                    this._myBlurRecoverHeadTransform = null;
                    this._myBlurRecoverPlayerUp = null;
                }
            } else {
                this._myBlurRecoverHeadTransform = null;
                this._myBlurRecoverPlayerUp = null;
            }
        } else {
            this._myDelaySessionChangeResyncCounter = 2;

            this._myBlurRecoverHeadTransform = null;
            this._myBlurRecoverPlayerUp = null;
        }

        //console.error("blur end");
    },
    _onViewReset() {
        if (this._mySessionActive) {
            //console.error("reset");
            this._teleportPlayerTransform(this._myCurrentHeadObject.pp_getTransformQuat());
        }
    },
    _getHeadHeight(headPosition) {
        let playerPosition = this._myPlayerObject.pp_getPosition();
        let playerUp = this._myPlayerObject.pp_getUp();

        let headDisplacement = headPosition.vec3_sub(playerPosition);
        let height = headDisplacement.vec3_componentAlongAxis(playerUp).vec3_length();

        return height;
    },
    _teleportPlayerTransform(headTransform) {
        let headPosition = headTransform.quat2_getPosition();
        let headHeight = this._getHeadHeight(headPosition);

        let playerUp = this._myPlayerObject.pp_getUp();
        let newPlayerPosition = headPosition.vec3_sub(playerUp.vec3_scale(headHeight));

        this._myPlayerObject.pp_setPosition(newPlayerPosition);

        let playerForward = this._myPlayerObject.pp_getForward();
        let headForward = headTransform.quat2_getAxes()[2];
        let headForwardNegated = headForward.vec3_negate(); // the head is rotated 180 degrees from the player for rendering reasons

        let rotationToPerform = playerForward.vec3_lookToPivotedQuat(headForwardNegated, playerUp);

        this._myPlayerObject.pp_rotateQuat(rotationToPerform);
    },
    _headToPlayer() {
        let headPosition = this._myCurrentHeadObject.pp_getPosition();
        let headHeight = this._getHeadHeight(headPosition);

        let playerPosition = this._myPlayerObject.pp_getPosition();
        let playerUp = this._myPlayerObject.pp_getUp();
        let headToPlayerPosition = playerPosition.vec3_add(playerUp.vec3_scale(headHeight));

        this._teleportHeadPosition(headToPlayerPosition);

        let playerForward = this._myPlayerObject.pp_getForward();
        let headForward = this._myCurrentHeadObject.pp_getForward();
        let headForwardNegated = headForward.vec3_negate(); // the head is rotated 180 degrees from the player for rendering reasons

        let rotationToPerform = headForwardNegated.vec3_lookToPivotedQuat(playerForward, playerUp);
        this._rotateHead(rotationToPerform);
    },
    _blurEndResync() {
        if (this._myBlurRecoverHeadTransform != null) {
            let playerUp = this._myPlayerObject.pp_getUp();
            if (playerUp.vec3_angle(this._myBlurRecoverPlayerUp) == 0) {
                let headHeight = this._getHeadHeight(this._myCurrentHeadObject.pp_getPosition());
                let recoverHeadHeight = this._getHeadHeight(this._myBlurRecoverHeadTransform.quat2_getPosition());

                let recoverHeadPosition = this._myBlurRecoverHeadTransform.quat2_getPosition();
                let newHeadPosition = recoverHeadPosition.vec3_add(playerUp.vec3_scale(headHeight - recoverHeadHeight));

                let recoverHeadForward = this._myBlurRecoverHeadTransform.quat2_getAxes()[2];
                let currentHeadForward = this._myCurrentHeadObject.pp_getForward();
                let rotationToPerform = currentHeadForward.vec3_lookToPivotedQuat(recoverHeadForward, playerUp);

                this._teleportHeadPosition(newHeadPosition);
                this._rotateHead(rotationToPerform);

                //console.error("blur end resync");
            }
        }

        this._myBlurRecoverHeadTransform = null;
        this._myBlurRecoverPlayerUp = null;
    },
    _sessionChangeResync() {
        if (this._myBlurRecoverHeadTransform == null) {

            if (this._mySessionActive) {
                let currentHeadPosition = this._myCurrentHeadObject.pp_getPosition();
                let resyncHeadPosition = this._mySessionChangeResyncHeadTransform.quat2_getPosition();
                let resyncHeadRotation = this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat();

                let playerUp = this._myPlayerObject.pp_getUp();

                let flatCurrentHeadPosition = currentHeadPosition.vec3_removeComponentAlongAxis(playerUp);
                let flatResyncHeadPosition = resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp);

                let resyncMovement = flatResyncHeadPosition.vec3_sub(flatCurrentHeadPosition);
                this._moveHead(resyncMovement);

                let currentHeadForward = this._myCurrentHeadObject.pp_getForward();
                let resyncHeadForward = resyncHeadRotation.quat_getForward();
                let resyncHeadUp = resyncHeadRotation.quat_getUp();

                let rotationToPerform = null;

                let fixedResyncForward = resyncHeadForward;

                let minAngle = 1;
                if (resyncHeadForward.vec3_angle(playerUp) < minAngle) {
                    if (resyncHeadUp.vec3_isConcordant(playerUp)) {
                        fixedResyncForward = resyncHeadUp.vec3_negate();
                    } else {
                        fixedResyncForward = resyncHeadUp.pp_clone();
                    }
                } else if (resyncHeadForward.vec3_angle(playerUp.vec3_negate()) < minAngle) {
                    if (resyncHeadUp.vec3_isConcordant(playerUp)) {
                        fixedResyncForward = resyncHeadUp.pp_clone();
                    } else {
                        fixedResyncForward = resyncHeadUp.vec3_negate();
                    }
                }

                if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
                    rotationToPerform = currentHeadForward.vec3_lookToPivotedQuat(fixedResyncForward.vec3_negate(), playerUp);
                } else {
                    rotationToPerform = currentHeadForward.vec3_lookToPivotedQuat(fixedResyncForward, playerUp);
                }

                this._rotateHead(rotationToPerform);
            } else {
                let playerUp = this._myPlayerObject.pp_getUp();
                let resyncHeadPosition = this._mySessionChangeResyncHeadTransform.quat2_getPosition();
                let flatResyncHeadPosition = resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp);

                let playerPosition = this._myPlayerObject.pp_getPosition();
                let newPlayerPosition = flatResyncHeadPosition.vec3_add(playerPosition.vec3_componentAlongAxis(playerUp));

                this._myPlayerObject.pp_setPosition(newPlayerPosition);
                this._myCurrentNonVRCameraObject.pp_resetPositionLocal();
                let currentHeadPosition = this._myCurrentNonVRCameraObject.pp_getPosition();

                let resyncHeadHeight = this._getHeadHeight(resyncHeadPosition);
                let currentHeadHeight = this._getHeadHeight(currentHeadPosition);
                this._myCurrentNonVRCameraObject.pp_setPosition(playerUp.vec3_scale(resyncHeadHeight - currentHeadHeight).vec3_add(newPlayerPosition));

                let resyncHeadRotation = this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat();

                if (this._myRemoveXTilt) {
                    let resyncHeadForward = resyncHeadRotation.quat_getForward();

                    let fixedHeadRight = resyncHeadForward.vec3_cross(playerUp);
                    if (!resyncHeadRotation.quat_getUp().vec3_isConcordant(playerUp)) {
                        fixedHeadRight.vec3_negate(fixedHeadRight);
                    }
                    fixedHeadRight.vec3_normalize(fixedHeadRight);
                    if (fixedHeadRight.vec3_length() == 0) {
                        fixedHeadRight = resyncHeadRotation.quat_getRight();
                    }

                    let fixedHeadUp = fixedHeadRight.vec3_cross(resyncHeadForward);
                    fixedHeadUp.vec3_normalize(fixedHeadUp);
                    let fixedHeadForward = fixedHeadUp.vec3_cross(fixedHeadRight);
                    fixedHeadForward.vec3_normalize(fixedHeadForward);

                    let fixedHeadRotation = PP.quat_create();
                    fixedHeadRotation.quat_fromAxes(fixedHeadRight.vec3_negate(), fixedHeadUp, fixedHeadForward);
                    resyncHeadRotation = fixedHeadRotation;
                }

                if (this._myPreventHeadUpsideDown) {
                    let resyncHeadUp = resyncHeadRotation.quat_getUp();
                    let resyncHeadRight = resyncHeadRotation.quat_getRight();

                    if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
                        let signedAngle = resyncHeadUp.vec3_angleSigned(playerUp, resyncHeadRight);
                        if (signedAngle > 0) {
                            signedAngle -= 89.995;
                        } else {
                            signedAngle += 89.995;
                        }

                        let fixedHeadUp = resyncHeadUp.vec3_rotateAxis(signedAngle, resyncHeadRight);
                        fixedHeadUp.vec3_normalize(fixedHeadUp);
                        let fixedHeadForward = fixedHeadUp.vec3_cross(resyncHeadRight);
                        fixedHeadForward.vec3_normalize(fixedHeadForward);
                        let fixedHeadRight = fixedHeadForward.vec3_cross(fixedHeadUp);
                        fixedHeadRight.vec3_normalize(fixedHeadRight);

                        let fixedHeadRotation = PP.quat_create();
                        fixedHeadRotation.quat_fromAxes(fixedHeadRight.vec3_negate(), fixedHeadUp, fixedHeadForward);
                        resyncHeadRotation = fixedHeadRotation;
                    }
                }

                this._myPreTiltMatrix.mat4_setPositionRotationQuat(this._myDirectionReferenceObject.pp_getPosition(), this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat());
                this._myTiltMatrix.mat4_setPositionRotationQuat(this._myDirectionReferenceObject.pp_getPosition(), resyncHeadRotation);

                resyncHeadRotation.quat_rotateAxisRadians(Math.PI, resyncHeadRotation.quat_getUp(), resyncHeadRotation);
                this._myCurrentNonVRCameraObject.pp_setRotationQuat(resyncHeadRotation);
            }
        }
    },
    _getHeadOnPlayerTransform() {
        let headPosition = this._myCurrentHeadObject.pp_getPosition();
        let headHeight = this._getHeadHeight(headPosition);

        let playerPosition = this._myPlayerObject.pp_getPosition();
        let playerUp = this._myPlayerObject.pp_getUp();
        let headOnPlayerPosition = playerPosition.vec3_add(playerUp.vec3_scale(headHeight));

        let playerRotation = this._myPlayerObject.pp_getRotationQuat();

        let transform = PP.quat2_create();
        transform.quat2_setPositionRotationQuat(headOnPlayerPosition, playerRotation);

        return transform;
    }
});