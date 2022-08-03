PP.KeyCode = {
    _0: 48,
    _1: 49,
    _2: 50,
    _3: 51,
    _4: 52,
    _5: 53,
    _6: 54,
    _7: 55,
    _8: 56,
    _9: 57,

    W: 87,
    A: 65,
    S: 83,
    D: 68,

    Q: 81,
    E: 69,
    R: 82,

    C: 67,
    F: 70,

    I: 73,
    J: 74,
    K: 75,
    L: 76,

    Y: 89,
    U: 85,
    O: 79,

    N: 78,
    H: 72,

    SPACE: 32,
    BACKSPACE: 8,
    SHIFT: 16,
    CONTROL: 17,
    ENTER: 13,
    ESC: 27,

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
};

PP.Keyboard = class Keyboard {
    constructor() {
        this._myKeys = new Map();

        for (let keyCode in PP.KeyCode) {
            this.addKey(PP.KeyCode[keyCode]);
        }
    }

    isPressed(keyCode) {
        let isPressed = false;

        if (this._myKeys.has(keyCode)) {
            isPressed = this._myKeys.get(keyCode);
        }

        return isPressed;
    }

    addKey(keyCode) {
        this._myKeys.set(keyCode, false);
    }

    start() {
        window.addEventListener('keydown', this._keyDown.bind(this));
        window.addEventListener('keyup', this._keyUp.bind(this));
    }

    update(dt) {
        if (!document.hasFocus()) {
            for (let keyCode of this._myKeys.keys()) {
                this._myKeys.set(keyCode, false);
            }
        }
    }

    _keyDown(event) {
        this._keyChanged(event.keyCode, true);
    }

    _keyUp(event) {
        this._keyChanged(event.keyCode, false);
    }

    _keyChanged(keyCode, isDown) {
        if (this._myKeys.has(keyCode)) {
            this._myKeys.set(keyCode, isDown);
        }
    }
};