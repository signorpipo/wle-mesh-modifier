WL.registerComponent('pp-gamepad-control-scheme', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },

    _mySelectText: { type: WL.Type.String, default: "" },
    _mySqueezeText: { type: WL.Type.String, default: "" },
    _myThumbstickText: { type: WL.Type.String, default: "" },
    _myBottomButtonText: { type: WL.Type.String, default: "" },
    _myTopButtonText: { type: WL.Type.String, default: "" },

    _mySelect: { type: WL.Type.Object, default: null },
    _mySqueeze: { type: WL.Type.Object, default: null },
    _myThumbstick: { type: WL.Type.Object, default: null },
    _myBottomButton: { type: WL.Type.Object, default: null },
    _myTopButton: { type: WL.Type.Object, default: null },

    _myCubeMesh: { type: WL.Type.Mesh },
    _myTextMaterial: { type: WL.Type.Material },
    _myFlatMaterial: { type: WL.Type.Material }
}, {
    init: function () {
    },
    start: function () {
        this._myTextMaterial = this._myTextMaterial.clone();
        this._myFlatMaterial = this._myFlatMaterial.clone();

        this._myHandednessType = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        this._myControlSchemeDirection = (this._myHandednessType == PP.Handedness.LEFT) ? 1 : -1;

        this._createControlScheme();
    },
    update: function (dt) {
    },
    _createControlScheme() {
        this._myRootObject = this.object.pp_addObject();

        let objectScale = this.object.pp_getScale();
        this.object.pp_resetScale();

        let distanceFromButton = 0.015;
        let lineLength = 0.11;

        let referenceObject = this._myThumbstick;

        this._mySelectObject = this._myRootObject.pp_addObject();
        this._mySelectTextComponent = this._addScheme(this._mySelect, referenceObject, [0, distanceFromButton, 0], [lineLength * this._myControlSchemeDirection, 0, 0], this._mySelectObject);
        this._mySelectTextComponent.text = this._mySelectText;

        this._mySqueezeObject = this._myRootObject.pp_addObject();
        this._mySqueezeTextComponent = this._addScheme(this._mySqueeze, referenceObject, [distanceFromButton * this._myControlSchemeDirection, 0, 0], [lineLength * this._myControlSchemeDirection, 0, 0], this._mySqueezeObject);
        this._mySqueezeTextComponent.text = this._mySqueezeText;

        this._myThumbstickObject = this._myRootObject.pp_addObject();
        this._myThumbstickTextComponent = this._addScheme(this._myThumbstick, referenceObject, [0, 0, -distanceFromButton], [-lineLength * this._myControlSchemeDirection, 0, 0], this._myThumbstickObject);
        this._myThumbstickTextComponent.text = this._myThumbstickText;

        this._myBottomButtonObject = this._myRootObject.pp_addObject();
        this._myBottomButtonTextComponent = this._addScheme(this._myBottomButton, referenceObject, [0, 0, -distanceFromButton], [0, -lineLength, 0], this._myBottomButtonObject);
        this._myBottomButtonTextComponent.text = this._myBottomButtonText;

        this._myTopButtonObject = this._myRootObject.pp_addObject();
        let topButtonEndOffset = [-lineLength * this._myControlSchemeDirection, 0, 0].vec3_rotateAxis(-45, [0, 0, 1]);
        this._myTopButtonTextComponent = this._addScheme(this._myTopButton, referenceObject, [0, 0, -distanceFromButton], topButtonEndOffset, this._myTopButtonObject);
        this._myTopButtonTextComponent.text = this._myTopButtonText;

        this.object.pp_setScale(objectScale);
    },
    _addScheme(buttonObject, referenceObject, startOffset, endOffset, parentObject) {
        let buttonPosition = buttonObject.pp_getPosition();
        let buttonForward = referenceObject.pp_getForward();
        let buttonRight = referenceObject.pp_getRight();
        let buttonUp = referenceObject.pp_getUp();

        let lineStart = buttonPosition.vec3_add(buttonRight.vec3_scale(startOffset[0]));
        lineStart.vec3_add(buttonUp.vec3_scale(startOffset[1]), lineStart);
        lineStart.vec3_add(buttonForward.vec3_scale(startOffset[2]), lineStart);

        let lineEnd = lineStart.vec3_add(buttonRight.vec3_scale(endOffset[0]));
        lineEnd.vec3_add(buttonUp.vec3_scale(endOffset[1]), lineEnd);
        lineEnd.vec3_add(buttonForward.vec3_scale(endOffset[2]), lineEnd);

        let textOffset = 0.01;
        let textPosition = lineEnd.vec3_add(buttonUp.vec3_scale(-textOffset));

        this._addLine(lineStart, lineEnd, parentObject);
        let textComponent = this._addText(textPosition, buttonForward, buttonUp, parentObject);

        return textComponent;

    },
    _addLine(start, end, parentObject) {
        let lineDirection = end.vec3_sub(start);
        let length = lineDirection.vec3_length();
        lineDirection.vec3_normalize(lineDirection);

        lineRootObject = parentObject.pp_addObject();
        lineObject = lineRootObject.pp_addObject();

        let lineMesh = lineObject.addComponent('mesh');
        lineMesh.mesh = this._myCubeMesh;
        lineMesh.material = this._myFlatMaterial;

        lineRootObject.pp_setPosition(start);

        let thickness = 0.001;
        lineObject.pp_scaleObject([thickness / 2, thickness / 2, length / 2]);

        lineObject.pp_lookTo(lineDirection);
        lineObject.pp_translateObject([0, 0, length / 2]);
    },
    _addText(position, forward, up, parentObject) {
        let textObject = parentObject.pp_addObject();
        textObject.pp_setPosition(position);
        textObject.pp_lookTo(forward.vec3_negate(), up);
        textObject.pp_scaleObject(0.08);

        let textComponent = textObject.pp_addComponent("text");
        textComponent.alignment = WL.Alignment.Center;
        textComponent.justification = WL.Justification.Top;
        textComponent.material = this._myTextMaterial;

        return textComponent;
    }
});