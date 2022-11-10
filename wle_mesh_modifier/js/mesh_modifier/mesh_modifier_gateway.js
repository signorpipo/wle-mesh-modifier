WL.registerComponent("mesh-modifier-gateway", {
    _myForceMeshRefresh: { type: WL.Type.Bool, default: false },
    _myUpdateNormals: { type: WL.Type.Bool, default: false },
    _mySelectedVertexColor: { type: WL.Type.Int, default: 46 },
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myMeshObject: { type: WL.Type.Object },
    _myMeshFilePath: { type: WL.Type.String },
    _myMeshFileMaterial: { type: WL.Type.Material },
    _myAnimationToPlay: { type: WL.Type.Animation },
    _myRestPoseAnimation: { type: WL.Type.Animation },
    _myShadeType: { type: WL.Type.Enum, values: ['flat', 'smooth'], default: 'flat' },
    _myPointerObject: { type: WL.Type.Object },
    _myToolLabel: { type: WL.Type.Object },
    _myGroupLabel: { type: WL.Type.Object },
    _myVariantLabel: { type: WL.Type.Object },
    _myLeftControlScheme: { type: WL.Type.Object },
    _myRightControlScheme: { type: WL.Type.Object },
    _myPropsObject: { type: WL.Type.Object },
}, {
    init: function () {
        this._myStarted = false;
    },
    start: function () {
        if (this._myMeshObject == null) {
            WL.scene.append(this._myMeshFilePath).then(function (meshObject) {
                meshObject.pp_setParent(this._myPropsObject);
                meshObject.pp_resetTransformLocal();
                PP.MeshUtils.setMaterial(meshObject, this._myMeshFileMaterial);
                this._start(meshObject);
            }.bind(this)
            );
        } else {
            this._start(this._myMeshObject);
        }
    },
    update: function (dt) {
        if (this._myStarted) {
            this._myToolManager.update(dt);
        }
    },
    _start(meshObject) {
        let params = new ToolManagerParams();

        params.myForceMeshRefresh = this._myForceMeshRefresh;

        params.myMeshObject = meshObject;

        let animationComponent = params.myMeshObject.pp_getComponentHierarchy("animation");

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

        this._myStarted = true;
    }
});