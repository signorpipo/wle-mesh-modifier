WL.registerComponent('pp-input-manager', {
    _myGamepadFixForward: { type: WL.Type.Bool, default: true },
    _myMousePreventContextMenu: { type: WL.Type.Bool, default: true },
    _myMousePreventMiddleButtonScroll: { type: WL.Type.Bool, default: true },
}, {
    init() {
        this._myInputManager = new PP.InputManager();

        PP.myInputManager = this._myInputManager;

        PP.myMouse = this._myInputManager.getMouse();
        PP.myKeyboard = this._myInputManager.getKeyboard();

        PP.myGamepadManager = this._myInputManager.getGamepadManager();
        PP.myGamepads = PP.myGamepadManager.getGamepads();
        PP.myLeftGamepad = PP.myGamepadManager.getLeftGamepad();
        PP.myRightGamepad = PP.myGamepadManager.getRightGamepad();
    },
    start() {
        this._myInputManager.start();

        this._setupMousePrevent();
        this._addGamepadCores();
    },
    update(dt) {
        this._myInputManager.update(dt);
    },
    _setupMousePrevent() {
        if (this._myMousePreventContextMenu) {
            PP.myMouse.setContextMenuActive(false);
        }

        if (this._myMousePreventMiddleButtonScroll) {
            PP.myMouse.setMiddleButtonScrollActive(false);
        }
    },
    _addGamepadCores() {
        let handPoseParams = new PP.HandPoseParams();
        handPoseParams.myReferenceObject = PP.myPlayerObjects.myPlayerPivot;
        handPoseParams.myFixForward = this._myFixForward;
        handPoseParams.myForceEmulatedVelocities = false;

        let leftXRGamepadCore = new PP.XRGamepadCore(PP.Handedness.LEFT, handPoseParams);
        let rightXRGamepadCore = new PP.XRGamepadCore(PP.Handedness.RIGHT, handPoseParams);

        PP.myLeftGamepad.addGamepadCore("left_xr_gamepad", leftXRGamepadCore);
        PP.myRightGamepad.addGamepadCore("right_xr_gamepad", rightXRGamepadCore);

        let leftKeyboardGamepadCore = new PP.KeyboardGamepadCore(PP.Handedness.LEFT, leftXRGamepadCore.getHandPose());
        let rightKeyboardGamepadCore = new PP.KeyboardGamepadCore(PP.Handedness.RIGHT, rightXRGamepadCore.getHandPose());

        PP.myLeftGamepad.addGamepadCore("left_keyboard_gamepad", leftKeyboardGamepadCore);
        PP.myRightGamepad.addGamepadCore("right_keyboard_gamepad", rightKeyboardGamepadCore);
    }
});

PP.myInputManager = null;

PP.myMouse = null;

PP.myKeyboard = null;

PP.myGamepadManager = null;
PP.myGamepads = null;
PP.myLeftGamepad = null;
PP.myRightGamepad = null;