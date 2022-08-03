WL.registerComponent("mesh-modifier-gateway", {
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myMeshObject: { type: WL.Type.Object },
    _myMeshAnimationObject: { type: WL.Type.Object },
    _myAnimationToPlay: { type: WL.Type.Animation },
    _myAPoseAnimation: { type: WL.Type.Animation },
    _myShadeType: { type: WL.Type.Enum, values: ['flat', 'smooth'], default: 'flat' },
    _myPointerObject: { type: WL.Type.Object },
    _myToolLabel: { type: WL.Type.Object },
    _myGroupLabel: { type: WL.Type.Object },
    _myVariantLabel: { type: WL.Type.Object },
    _myLeftControlScheme: { type: WL.Type.Object },
    _myRightControlScheme: { type: WL.Type.Object },
}, {
    init: function () {

    },
    start: function () {
        let params = new ToolManagerParams();

        params.myMeshObject = this._myMeshObject;
        params.myMeshAnimationObject = this._myMeshAnimationObject;
        params.myAnimationToPlay = this._myAnimationToPlay;
        params.myAPoseAnimation = this._myAPoseAnimation;

        params.myIsFlatShading = this._myShadeType == 0;
        params.myPointerObject = this._myPointerObject;
        params.myToolLabel = this._myToolLabel;
        params.myGroupLabel = this._myGroupLabel;
        params.myVariantLabel = this._myVariantLabel;
        params.myVariantGroupCongigPath = this._myVertexGroupConfigPath;
        params.myLeftControlScheme = this._myLeftControlScheme.pp_getComponent("pp-gamepad-control-scheme");
        params.myRightControlScheme = this._myRightControlScheme.pp_getComponent("pp-gamepad-control-scheme");

        this._myToolManager = new ToolManager(params);
    },
    update: function (dt) {
        this._myToolManager.update(dt);
    },
});