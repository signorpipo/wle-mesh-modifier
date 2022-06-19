WL.registerComponent("mesh-modifier-gateway", {
    _myMeshObject: { type: WL.Type.Object },
    _myPointer: { type: WL.Type.Object },
    _myToolLabel: { type: WL.Type.Object }
}, {
    init: function () {

    },
    start: function () {
        this._myToolManager = new ToolManager(this._myMeshObject, this._myPointer, this._myToolLabel);

    },
    update: function (dt) {
        this._myToolManager.update(dt);
    },
});