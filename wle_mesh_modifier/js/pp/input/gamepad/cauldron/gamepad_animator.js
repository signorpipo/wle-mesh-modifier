/**
 * Animate the buttons of a gamepad, like pressing, thumbstick tilting and so on
 */
WL.registerComponent('pp-gamepad-animator', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _mySelect: { type: WL.Type.Object, default: null },
    _mySqueeze: { type: WL.Type.Object, default: null },
    _myThumbstick: { type: WL.Type.Object, default: null },
    _myBottomButton: { type: WL.Type.Object, default: null },
    _myTopButton: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        this._myGamepad = null;

        this._myNormalDiffuseButtonColor = null; //@EDIT with the color you want, or leave null to keep the material color, set all color variables or none
        this._myNormalAmbientButtonColor = null; // set them like this [x/255, y/255, z/255, w/255]
        this._myIsTouchedDiffuseButtonColor = null;
        this._myIsTouchedAmbientButtonColor = null;

        this._myThumbstickInitialLocalUp = this._getLocalAxis(this._myThumbstick, [0, 1, 0]);
        this._myThumbstickUp = [0, 1, 0];
        this._mySelectUp = [0, 1, 0];

        this._myIsMeshEnabled = false;
    },
    start: function () {
        if (this._myHandedness == 0) {
            this._myGamepad = PP.myLeftGamepad; //@EDIT get gamepad LEFT here based on how you store it in your game
        } else {
            this._myGamepad = PP.myRightGamepad; //@EDIT get gamepad RIGHT here based on how you store it in your game
        }

        this._mySelectMaterial = this._mySelect.getComponent("mesh").material.clone();
        this._mySelect.getComponent("mesh").material = this._mySelectMaterial;
        this._mySelectPosition = new Float32Array(3);
        this._mySelect.getTranslationLocal(this._mySelectPosition);
        if (this._myNormalDiffuseButtonColor) {
            this._mySelectMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._mySelectMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }

        this._mySqueezeMaterial = this._mySqueeze.getComponent("mesh").material.clone();
        this._mySqueeze.getComponent("mesh").material = this._mySqueezeMaterial;
        this._mySqueezePosition = new Float32Array(3);
        this._mySqueeze.getTranslationLocal(this._mySqueezePosition);
        if (this._myNormalDiffuseButtonColor) {
            this._mySqueezeMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._mySqueezeMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }

        this._myThumbstickMaterial = this._myThumbstick.getComponent("mesh").material.clone();
        this._myThumbstick.getComponent("mesh").material = this._myThumbstickMaterial;
        this._myThumbstickPosition = new Float32Array(3);
        this._myThumbstick.getTranslationLocal(this._myThumbstickPosition);
        if (this._myNormalDiffuseButtonColor) {
            this._myThumbstickMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myThumbstickMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }

        this._myBottomButtonMaterial = this._myBottomButton.getComponent("mesh").material.clone();
        this._myBottomButton.getComponent("mesh").material = this._myBottomButtonMaterial;
        this._myBottomButtonPosition = new Float32Array(3);
        this._myBottomButton.getTranslationLocal(this._myBottomButtonPosition);
        if (this._myNormalDiffuseButtonColor) {
            this._myBottomButtonMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myBottomButtonMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }

        this._myTopButtonMaterial = this._myTopButton.getComponent("mesh").material.clone();
        this._myTopButton.getComponent("mesh").material = this._myTopButtonMaterial;
        this._myTopButtonPosition = new Float32Array(3);
        this._myTopButton.getTranslationLocal(this._myTopButtonPosition);
        if (this._myNormalDiffuseButtonColor) {
            this._myTopButtonMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myTopButtonMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }

        //PRESSED
        this._myGamepad.registerButtonEventListener(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESS_START, this, this._thumbstickPressedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESS_END, this, this._thumbstickPressedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESS_START, this, this._bottomButtonPressedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESS_END, this, this._bottomButtonPressedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESS_START, this, this._topButtonPressedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESS_END, this, this._topButtonPressedEnd.bind(this));

        //TOUCHED
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCH_START, this, this._selectTouchedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCH_END, this, this._selectTouchedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCH_START, this, this._squeezeTouchedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCH_END, this, this._squeezeTouchedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCH_START, this, this._thumbstickTouchedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCH_END, this, this._thumbstickTouchedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.TOUCH_START, this, this._bottomButtonTouchedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.TOUCH_END, this, this._bottomButtonTouchedEnd.bind(this));

        this._myGamepad.registerButtonEventListener(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.TOUCH_START, this, this._topButtonTouchedStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.TOUCH_END, this, this._topButtonTouchedEnd.bind(this));

        //VALUE CHANGED
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.VALUE_CHANGED, this, this._squeezeValueChanged.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.VALUE_CHANGED, this, this._selectValueChanged.bind(this));

        //AXES CHANGED
        this._myGamepad.registerAxesEventListener(PP.AxesEvent.AXES_CHANGED, this, this._axesValueChanged.bind(this));

        this._myFirstUpdate = true;
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this.object.pp_setScaleLocal([0.00001, 0.00001, 0.00001]);
        }

        this._enableMeshInSession();
    },
    _thumbstickPressedStart: function (buttonInfo, gamepad) {
        //since thumbstick object rotate I need to specifically use its initial up
        let tempVector = PP.vec3_create();
        this._myThumbstickInitialLocalUp.vec3_scale(-0.0015, tempVector);
        this._myThumbstick.translate(tempVector);
    },
    _thumbstickPressedEnd: function (buttonInfo, gamepad) {
        let tempVector = PP.vec3_create();
        this._myThumbstickInitialLocalUp.vec3_scale(0.0015, tempVector);
        this._myThumbstick.translate(tempVector);
    },
    _bottomButtonPressedStart: function (buttonInfo, gamepad) {
        this._translateLocalAxis(this._myBottomButton, [0, 1, 0], -0.002);
    },
    _bottomButtonPressedEnd: function (buttonInfo, gamepad) {
        this._translateLocalAxis(this._myBottomButton, [0, 1, 0], 0.002);
    },
    _topButtonPressedStart: function (buttonInfo, gamepad) {
        this._translateLocalAxis(this._myTopButton, [0, 1, 0], -0.002);
    },
    _topButtonPressedEnd: function (buttonInfo, gamepad) {
        this._translateLocalAxis(this._myTopButton, [0, 1, 0], 0.002);
    },
    //TOUCHED
    _selectTouchedStart: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._mySelectMaterial.diffuseColor = this._myIsTouchedDiffuseButtonColor;
            this._mySelectMaterial.ambientColor = this._myIsTouchedAmbientButtonColor;
        }
    },
    _selectTouchedEnd: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._mySelectMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._mySelectMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }
    },
    _squeezeTouchedStart: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._mySqueezeMaterial.diffuseColor = this._myIsTouchedDiffuseButtonColor;
            this._mySqueezeMaterial.ambientColor = this._myIsTouchedAmbientButtonColor;
        }
    },
    _squeezeTouchedEnd: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._mySqueezeMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._mySqueezeMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }
    },
    _thumbstickTouchedStart: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myThumbstickMaterial.diffuseColor = this._myIsTouchedDiffuseButtonColor;
            this._myThumbstickMaterial.ambientColor = this._myIsTouchedAmbientButtonColor;
        }
    },
    _thumbstickTouchedEnd: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myThumbstickMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myThumbstickMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }
    },
    _bottomButtonTouchedStart: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myBottomButtonMaterial.diffuseColor = this._myIsTouchedDiffuseButtonColor;
            this._myBottomButtonMaterial.ambientColor = this._myIsTouchedAmbientButtonColor;
        }
    },
    _bottomButtonTouchedEnd: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myBottomButtonMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myBottomButtonMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }
    },
    _topButtonTouchedStart: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myTopButtonMaterial.diffuseColor = this._myIsTouchedDiffuseButtonColor;
            this._myTopButtonMaterial.ambientColor = this._myIsTouchedAmbientButtonColor;
        }
    },
    _topButtonTouchedEnd: function (buttonInfo, gamepad) {
        if (this._myNormalDiffuseButtonColor) {
            this._myTopButtonMaterial.diffuseColor = this._myNormalDiffuseButtonColor;
            this._myTopButtonMaterial.ambientColor = this._myNormalAmbientButtonColor;
        }
    },
    _selectValueChanged: function (buttonInfo, gamepad) {
        //first reset rotation to start position
        this._copyAlignRotation(this._mySelect, this._mySelectUp, [0, 1, 0]);

        let angleToRotate = Math.pp_toRadians(15 * buttonInfo.myValue);
        let tiltDirection = [0, 1, 0];
        tiltDirection.vec3_rotateAxisRadians(angleToRotate, [1, 0, 0], tiltDirection);
        tiltDirection.vec3_normalize(tiltDirection);

        this._copyAlignRotation(this._mySelect, [0, 1, 0], tiltDirection);

        this._mySelectUp = tiltDirection;
    },
    _squeezeValueChanged: function (buttonInfo, gamepad) {
        this._mySqueeze.setTranslationLocal(this._mySqueezePosition);
        let translation = 0.0015;
        if (this._myHandedness == 1) {
            translation *= -1;
        }
        this._translateLocalAxis(this._mySqueeze, [1, 0, 0], translation * buttonInfo.myValue);
    },
    _axesValueChanged: function (axesInfo, gamepad) {
        //first reset rotation to start position
        this._copyAlignRotation(this._myThumbstick, this._myThumbstickUp, [0, 1, 0]);

        let tiltDirection = new Float32Array(3);
        let up = [0, 1, 0];
        up.vec3_add([-axesInfo.myAxes[0], 0.0, axesInfo.myAxes[1]], tiltDirection);
        tiltDirection.vec3_normalize(tiltDirection);

        this._copyAlignRotation(this._myThumbstick, [0, 1, 0], tiltDirection);

        this._myThumbstickUp = tiltDirection;
    },
    //Couldn't find a better name, basically find the rotation to align start axis to end, and apply that to object
    _copyAlignRotation: function (object, startAxis, endAxis) {
        let rotationAxis = new Float32Array(3);
        startAxis.vec3_cross(endAxis, rotationAxis);
        rotationAxis.vec3_normalize(rotationAxis);

        let angleToRotate = startAxis.vec3_angleRadians(endAxis);

        if (angleToRotate > 0.0001) {
            object.rotateAxisAngleRadObject(rotationAxis, angleToRotate);
        }
    },
    _translateLocalAxis(object, axis, amount) {
        let tempVector = this._getLocalAxis(object, axis);
        tempVector.vec3_scale(amount, tempVector);
        object.translate(tempVector);
    },
    _getLocalAxis(object, axis) {
        let tempVector = PP.vec3_create();
        axis.vec3_transformQuat(object.transformLocal, tempVector);
        tempVector.vec3_normalize(tempVector);
        return tempVector;
    },
    _enableMeshInSession: function () {
        if (!this._myIsMeshEnabled) {
            if (WL.xrSession) {
                this.object.pp_resetScaleLocal();
                this._myIsMeshEnabled = true;
            }
        }
    }
});