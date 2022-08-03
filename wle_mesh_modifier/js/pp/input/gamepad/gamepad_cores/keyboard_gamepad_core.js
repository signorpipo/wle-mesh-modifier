// xr-standard mapping is assumed
PP.KeyboardGamepadCore = class KeyboardGamepadCore extends PP.GamepadCore {

    constructor(handedness, handPose) {
        super(handedness);

        this._myHandPose = handPose; // can be null for keyboard
        this._myHandPoseUpdateActive = false;

        this._myKeyboard = new PP.Keyboard();
    }

    getHandedness() {
        return this._myHandedness;
    }

    getHandPose() {
        return this._myHandPose;
    }

    setHandPoseUpdateActive(active) {
        this._myHandPoseUpdateActive = active;
    }

    isHandPoseUpdateActive() {
        return this._myHandPoseUpdateActive;
    }

    isGamepadCoreActive() {
        return true;
    }

    start() {
        this._myKeyboard.start();

        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.start();
        }
    }

    preUpdate(dt) {
        this._myKeyboard.update(dt);

        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.update(dt);
        }
    }

    getButtonData(buttonType) {
        let buttonData = { myIsPressed: false, myIsTouched: false, myValue: 0 };

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                switch (buttonType) {
                    case PP.ButtonType.SELECT:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.C);
                        break;
                    case PP.ButtonType.SQUEEZE:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.F);
                        break;
                    case PP.ButtonType.THUMBSTICK:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.R);
                        break;
                    case PP.ButtonType.TOP_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.E);
                        break;
                    case PP.ButtonType.BOTTOM_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.Q);
                        break;
                }
            } else {
                switch (buttonType) {
                    case PP.ButtonType.SELECT:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.N);
                        break;
                    case PP.ButtonType.SQUEEZE:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.H);
                        break;
                    case PP.ButtonType.THUMBSTICK:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.Y);
                        break;
                    case PP.ButtonType.TOP_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.U);
                        break;
                    case PP.ButtonType.BOTTOM_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isPressed(PP.KeyCode.O);
                        break;
                }
            }
        }

        if (buttonData.myIsPressed) {
            buttonData.myIsTouched = true;
            buttonData.myValue = 1;
        }

        return buttonData;
    }

    getAxesData() {
        let axes = [0.0, 0.0];

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                if (this._myKeyboard.isPressed(PP.KeyCode.W)) axes[1] += 1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.S)) axes[1] += -1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.D)) axes[0] += 1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.A)) axes[0] += -1.0;
            } else {
                if (this._myKeyboard.isPressed(PP.KeyCode.I) || this._myKeyboard.isPressed(PP.KeyCode.UP)) axes[1] += 1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.K) || this._myKeyboard.isPressed(PP.KeyCode.DOWN)) axes[1] += -1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.L) || this._myKeyboard.isPressed(PP.KeyCode.RIGHT)) axes[0] += 1.0;
                if (this._myKeyboard.isPressed(PP.KeyCode.J) || this._myKeyboard.isPressed(PP.KeyCode.LEFT)) axes[0] += -1.0;
            }
        }

        return axes;
    }

    getHapticActuators() {
        let hapticActuators = [];
        return hapticActuators;
    }
};