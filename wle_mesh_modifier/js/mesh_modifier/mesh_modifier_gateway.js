WL.registerComponent("mesh-modifier-gateway", {
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myMeshObject: { type: WL.Type.Object },
    _myPointer: { type: WL.Type.Object },
    _myToolLabel: { type: WL.Type.Object },
    _myGroupLabel: { type: WL.Type.Object },
    _myVariantLabel: { type: WL.Type.Object },
}, {
    init: function () {

    },
    start: function () {
        this._myToolManager = new ToolManager(this._myMeshObject, this._myPointer, this._myToolLabel, this._myGroupLabel, this._myVariantLabel, this._myVertexGroupConfigPath);
    },
    update: function (dt) {
        this._myToolManager.update(dt);
    },
});