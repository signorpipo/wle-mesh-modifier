WL.registerComponent("mesh-modifier-gateway", {
    _myForceMeshRefresh: { type: WL.Type.Bool, default: false },
    _myUpdateNormals: { type: WL.Type.Bool, default: false },
    _mySelectedVertexColor: { type: WL.Type.Int, default: 46 },
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myMeshObject: { type: WL.Type.Object },
    _myAnimationToPlay: { type: WL.Type.Animation },
    _myRestPoseAnimation: { type: WL.Type.Animation },
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

        params.myForceMeshRefresh = this._myForceMeshRefresh;

        params.myMeshObject = this._myMeshObject;

        let animationComponent = this._myMeshObject.pp_getComponentHierarchy("animation");

        if (animationComponent != null) {
            params.myMeshAnimationObject = animationComponent.object;
        }

        params.myAnimationToPlay = this._myAnimationToPlay;
        params.myRestPoseAnimation = this._myRestPoseAnimation;

        params.myIsFlatShading = this._myShadeType == 0;
        params.myPointerObject = this._myPointerObject;
        params.myToolLabel = this._myToolLabel;
        params.myGroupLabel = this._myGroupLabel;
        params.myVariantLabel = this._myVariantLabel;
        params.myVariantGroupCongigPath = this._myVertexGroupConfigPath;
        params.myLeftControlScheme = this._myLeftControlScheme.pp_getComponent("pp-gamepad-control-scheme");
        params.myRightControlScheme = this._myRightControlScheme.pp_getComponent("pp-gamepad-control-scheme");

        selectedVertexColor = this._mySelectedVertexColor;
        VertexUtils.updateVertexNormalsActive = this._myUpdateNormals;

        this._myToolManager = new ToolManager(params);
    },
    update: function (dt) {
        this._myToolManager.update(dt);
    },
});