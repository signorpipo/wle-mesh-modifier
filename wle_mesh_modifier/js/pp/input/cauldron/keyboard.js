PP.KeyType = {
    _0: "0",
    _1: "1",
    _2: "2",
    _3: "3",
    _4: "4",
    _5: "5",
    _6: "6",
    _7: "7",
    _8: "8",
    _9: "9",

    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    H: "H",
    I: "I",
    J: "J",
    K: "K",
    L: "L",
    M: "M",
    N: "N",
    O: "O",
    P: "P",
    Q: "Q",
    R: "R",
    S: "S",
    T: "T",
    U: "U",
    V: "V",
    W: "W",
    X: "X",
    Y: "Y",
    Z: "Z",

    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
    g: "g",
    h: "h",
    i: "i",
    j: "j",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    o: "o",
    p: "p",
    q: "q",
    r: "r",
    s: "s",
    t: "t",
    u: "u",
    v: "v",
    w: "w",
    x: "x",
    y: "y",
    z: "z",

    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",

    SPACE: " ",
    ENTER: "Enter",
    BACKSPACE: "Backspace",
    ESC: "Escape",

    SHIFT_LEFT: "ShiftLeft",
    SHIFT_RIGHT: "ShiftRight",
    CONTROL_LEFT: "ControlLeft",
    CONTROL_RIGHT: "ControlRight",
    ALT_LEFT: "AltLeft",
    ALT_RIGHT: "AltRight",
};

PP.Keyboard = class Keyboard {
    constructor() {
        this._myKeyInfos = new Map();

        for (let keyType in PP.KeyType) {
            this.addKey(PP.KeyType[keyType]);
        }
    }

    isKeyPressed(keyType) {
        let isPressed = false;

        if (this._myKeyInfos.has(keyType)) {
            isPressed = this._myKeyInfos.get(keyType).myIsPressed;
        }

        return isPressed;
    }

    isKeyPressStart(keyType) {
        let isPressStart = false;

        if (this._myKeyInfos.has(keyType)) {
            isPressStart = this._myKeyInfos.get(keyType).myIsPressStart;
        }

        return isPressStart;
    }

    isKeyPressEnd(keyType) {
        let isPressEnd = false;

        if (this._myKeyInfos.has(keyType)) {
            isPressEnd = this._myKeyInfos.get(keyType).myIsPressEnd;
        }

        return isPressEnd;
    }

    addKey(keyType) {
        this._myKeyInfos.set(keyType,
            { myIsPressed: false, myIsPressStart: false, myIsPressStartToProcess: false, myIsPressEnd: false, myIsPressEndToProcess: false, });
    }

    start() {
        window.addEventListener('keydown', this._keyDown.bind(this));
        window.addEventListener('keyup', this._keyUp.bind(this));
    }

    update(dt) {
        if (!document.hasFocus()) {
            for (let keyInfo of this._myKeyInfos.values()) {
                if (keyInfo.myIsPressed) {
                    keyInfo.myIsPressed = false;
                    keyInfo.myIsPressEndToProcess = true;
                }
            }
        }

        for (let keyInfo of this._myKeyInfos.values()) {
            keyInfo.myIsPressStart = keyInfo.myIsPressStartToProcess;
            keyInfo.myIsPressEnd = keyInfo.myIsPressEndToProcess;
            keyInfo.myIsPressStartToProcess = false;
            keyInfo.myIsPressEndToProcess = false;
        }
    }

    _keyDown(event) {
        this._keyPressedChanged(event.key, true);
        if (event.key != event.code) {
            this._keyPressedChanged(event.code, true);
        }
    }

    _keyUp(event) {
        this._keyPressedChanged(event.key, false);
        if (event.key != event.code) {
            this._keyPressedChanged(event.code, false);
        }
    }

    _keyPressedChanged(keyType, isPressed) {
        if (this._myKeyInfos.has(keyType)) {
            let keyInfo = this._myKeyInfos.get(keyType);

            if (isPressed) {
                keyInfo.myIsPressed = true;
                keyInfo.myIsPressStartToProcess = true;
            } else {
                keyInfo.myIsPressed = false;
                keyInfo.myIsPressEndToProcess = true;
            }
        }
    }
};