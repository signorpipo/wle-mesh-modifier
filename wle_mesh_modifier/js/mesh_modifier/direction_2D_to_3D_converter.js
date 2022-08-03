Direction2DTo3DConverterParams = class Direction2DTo3DConverterParams {
    constructor() {
        this.myAutoUpdateFly = false;

        this.myMinAngleToFlyForwardUp = 90;
        this.myMinAngleToFlyForwardDown = 90;
        this.myMinAngleToFlyRightUp = 90;
        this.myMinAngleToFlyRightDown = 90;

        this.myStopFlyingWhenZero = true;
    }
};

Direction2DTo3DConverter = class Direction2DTo3DConverter {

    constructor(params = new Direction2DTo3DConverterParams()) {
        this._myParams = params;

        this._myIsFlyingForward = false;
        this._myIsFlyingRight = false;

        this._myLastValidFlatForward = PP.vec3_create();
        this._myLastValidFlatRight = PP.vec3_create();

        //Setup
        this._myMinAngleToBeValid = 5;
    }

    isFlying() {
        return this._myIsFlyingForward || this._myIsFlyingRight;
    }

    isFlyingForward() {
        return this._myIsFlyingForward;
    }

    isFlyingRight() {
        return this._myIsFlyingRight;
    }

    startFlying() {
        this._myIsFlyingForward = true;
        this._myIsFlyingRight = true;
    }

    startFlyingForward() {
        this._myIsFlyingForward = true;
    }

    startFlyingRight() {
        this._myIsFlyingRight = true;
    }

    stopFlying() {
        this._myIsFlyingForward = false;
        this._myIsFlyingRight = false;
    }

    stopFlyingForward() {
        this._myIsFlyingForward = false;
    }

    stopFlyingRight() {
        this._myIsFlyingRight = false;
    }

    reset(stopFlying = true) {
        if (stopFlying) {
            this.stopFlying();
        }
        this._myLastValidFlatForward.vec3_zero();
        this._myLastValidFlatRight.vec3_zero();
    }

    convert(direction2D, convertTransform, directionUp) {
        if (direction2D.vec2_isZero()) {
            let stopFlying = this._myParams.myAutoUpdateFly && this._myParams.myStopFlyingWhenZero;
            this.reset(stopFlying);
            return [0, 0, 0];
        } else {
            if (direction2D[0] == 0) {
                this._myLastValidFlatRight.vec3_zero();
            }

            if (direction2D[1] == 0) {
                this._myLastValidFlatForward.vec3_zero();
            }
        }

        let forward = convertTransform.mat4_getForward();
        let right = convertTransform.mat4_getRight();

        // check if it is flying based on the convert transform orientation 
        if (this._myParams.myAutoUpdateFly) {
            let angleForwardWithDirectionUp = forward.vec3_angle(directionUp);
            this._myIsFlyingForward = this._myIsFlyingForward ||
                (angleForwardWithDirectionUp < 90 - this._myParams.myMinAngleToFlyForwardUp || angleForwardWithDirectionUp > 90 + this._myParams.myMinAngleToFlyForwardDown);

            let angleRightWithDirectionUp = right.vec3_angle(directionUp);
            this._myIsFlyingRight = this._myIsFlyingRight ||
                (angleRightWithDirectionUp < 90 - this._myParams.myMinAngleToFlyRightUp || angleRightWithDirectionUp > 90 + this._myParams.myMinAngleToFlyRightDown);
        }

        // remove the component to prevent flying, if needed
        if (!this._myIsFlyingForward) {
            // if the forward is too similar to the up (or down) take the last valid forward
            if (!this._myLastValidFlatForward.vec3_isZero() && (forward.vec3_angle(directionUp) < this._myMinAngleToBeValid || forward.vec3_angle(directionUp.vec3_negate()) < this._myMinAngleToBeValid)) {
                if (forward.vec3_isConcordant(this._myLastValidFlatForward)) {
                    forward.pp_copy(this._myLastValidFlatForward);
                } else {
                    this._myLastValidFlatForward.vec3_negate(forward);
                }
            }

            forward.vec3_removeComponentAlongAxis(directionUp, forward);
            forward.vec3_normalize(forward);
        }

        if (!this._myIsFlyingRight) {
            // if the right is too similar to the up (or down) take the last valid right
            if (!this._myLastValidFlatRight.vec3_isZero() && (right.vec3_angle(directionUp) < this._myMinAngleToBeValid || right.vec3_angle(directionUp.vec3_negate()) < this._myMinAngleToBeValid)) {
                if (right.vec3_isConcordant(this._myLastValidFlatRight)) {
                    right.pp_copy(this._myLastValidFlatRight);
                } else {
                    this._myLastValidFlatRight.vec3_negate(right);
                }
            }

            right.vec3_removeComponentAlongAxis(directionUp, right);
            right.vec3_normalize(right);
        }


        // update last valid
        if ((forward.vec3_angle(directionUp) > this._myMinAngleToBeValid && forward.vec3_angle(directionUp.vec3_negate()) > this._myMinAngleToBeValid) ||
            (direction2D[1] != 0 && this._myLastValidFlatForward.vec3_isZero())) {
            forward.vec3_removeComponentAlongAxis(directionUp, this._myLastValidFlatForward);
            this._myLastValidFlatForward.vec3_normalize(this._myLastValidFlatForward);
        }

        if ((right.vec3_angle(directionUp) > this._myMinAngleToBeValid && right.vec3_angle(directionUp.vec3_negate()) > this._myMinAngleToBeValid) ||
            (direction2D[0] != 0 && this._myLastValidFlatRight.vec3_isZero())) {
            right.vec3_removeComponentAlongAxis(directionUp, this._myLastValidFlatRight);
            this._myLastValidFlatRight.vec3_normalize(this._myLastValidFlatRight);
        }

        // compute direction 3D
        let direction3D = right.vec3_scale(direction2D[0]).vec3_add(forward.vec3_scale(direction2D[1]));

        if (!this._myIsFlyingForward && !this._myIsFlyingRight) {
            direction3D.vec3_removeComponentAlongAxis(directionUp, direction3D);
        }

        direction3D.vec3_normalize(direction3D);

        return direction3D;
    }
};