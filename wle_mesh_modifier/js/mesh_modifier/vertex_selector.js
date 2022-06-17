WL.registerComponent('vertex_selector', {
    _mySelectedObject: { type: WL.Type.Object },
    _myLeftPointer: { type: WL.Type.Object },
    _myRightPointer: { type: WL.Type.Object }
}, {
    init: function () {

    },
    start: function () {
        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.POINT, 5000);
    },
    update: function (dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            this._selectVertex(this._mySelectedObject, this._myLeftPointer);
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            this._selectVertex(this._mySelectedObject, this._myRightPointer);
        }
    },
    _selectVertex(meshObject, pointerObject) {
        let pointerPosition = pointerObject.pp_getPosition();
        let mesh = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = mesh.object.pp_getTransform();
        let meshVertexes = mesh.mesh.vertexData;

        let vertexIndex = -1;
        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        for (let i = 0; i < meshVertexes.length / vertexDataSize; i++) {
            let vertexPosition = [meshVertexes[i * vertexDataSize + WL.Mesh.POS.X], meshVertexes[i * vertexDataSize + WL.Mesh.POS.Y], meshVertexes[i * vertexDataSize + WL.Mesh.POS.Z]];

            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

            let pointParams = new PP.DebugPointParams();
            pointParams.myPosition = vertexPositionWorld;
            pointParams.myRadius = 0.01;
            pointParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            PP.myDebugManager.draw(pointParams, 5);
        }
    }
});