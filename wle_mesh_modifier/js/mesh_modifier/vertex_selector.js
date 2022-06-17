WL.registerComponent('vertex_selector', {
    _mySelectedObject: { type: WL.Type.Object },
    _myLeftPointer: { type: WL.Type.Object },
    _myRightPointer: { type: WL.Type.Object },
    _myMinDistanceToSelect: { type: WL.Type.Float, default: 0.025 }
}, {
    init: function () {

    },
    start: function () {
        this._mySelectedVertexes = [];
        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.POINT, 5000);
    },
    update: function (dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            this._selectVertex(this._mySelectedObject, this._myLeftPointer);
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            this._selectVertex(this._mySelectedObject, this._myRightPointer);
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            this._mySelectedVertexes = [];
        }

        this._debugDraw(this._mySelectedObject);
    },
    _selectVertex(meshObject, pointerObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        let pointerPosition = pointerObject.pp_getPosition();

        let closestVertexIndex = this._getClosestVertexIndex(meshComponent.mesh, meshTransform, pointerPosition);
        let selectedVertexIndexes = this._getSameVertexIndexes(meshComponent.mesh, closestVertexIndex);

        let selectedVertexParams = new SelectedVertexParams(meshComponent.mesh, selectedVertexIndexes);

        let vertexPositionWorld = selectedVertexParams.getPosition(meshTransform);
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.push(selectedVertexParams);
        }
    },
    _getClosestVertexIndex(mesh, meshTransform, position) {
        let meshVertexes = mesh.vertexData;

        let minDistance = -1;
        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = meshVertexes.length / vertexDataSize;
        for (let i = 0; i < vertexCount; i++) {
            let vertexPosition = [
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.X],
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.Y],
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.Z]];

            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

            let distanceToPointer = vertexPositionWorld.vec3_distance(position);
            if (minDistance == -1 || distanceToPointer < minDistance) {
                minDistance = distanceToPointer;
                vertexIndex = i;
            }
        }

        return vertexIndex;
    },
    _getSameVertexIndexes(mesh, vertexIndex) {
        let selectedVertexIndexes = [];
        let meshVertexes = mesh.vertexData;
        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;

        let closestVertexPosition = [
            meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.X],
            meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.Y],
            meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.Z]];

        let vertexCount = meshVertexes.length / vertexDataSize;
        for (let i = 0; i < vertexCount; i++) {
            let vertexPosition = [
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.X],
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.Y],
                meshVertexes[i * vertexDataSize + WL.Mesh.POS.Z]];

            if (closestVertexPosition.pp_equals(vertexPosition)) {
                selectedVertexIndexes.push(i);
            }
        }

        return selectedVertexIndexes;
    },
    _debugDraw(meshObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        for (let selectedVertex of this._mySelectedVertexes) {
            selectedVertex.debugDraw(meshTransform);
        }
    }
});

class SelectedVertexParams {
    constructor(mesh, indexes) {
        this._myMesh = mesh;
        this._myIndexes = indexes;
    }

    getPosition(meshTransform) {
        let meshVertexes = this._myMesh.vertexData;
        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexPosition = [
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.X],
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.Y],
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.Z]];
        let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

        return vertexPositionWorld;
    }

    getNormal(meshTransform) {
        let normal = [0, 0, 0];
        let meshVertexes = this._myMesh.vertexData;

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        for (let vertexIndex of this._myIndexes) {
            let vertexNormal = [
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.X],
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.Y],
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.Z]];

            normal.vec3_add(vertexNormal, normal);
        }

        normal.vec3_normalize(normal);
        let normalWorld = normal.vec3_convertDirectionToWorld(meshTransform);

        return normalWorld;
    }

    debugDraw(meshTransform, lifetime = 0) {
        let vertexPositionWorld = this.getPosition(meshTransform);
        {
            let debugDrawParams = new PP.DebugPointParams();
            debugDrawParams.myPosition = vertexPositionWorld;
            debugDrawParams.myRadius = 0.005;
            debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            PP.myDebugManager.draw(debugDrawParams, lifetime);
        }

        let vertexNormalWorld = this.getNormal(meshTransform);
        {
            let debugDrawParams = new PP.DebugArrowParams();
            debugDrawParams.myStart = vertexPositionWorld;
            debugDrawParams.myDirection = vertexNormalWorld;
            debugDrawParams.myLength = 0.05;
            debugDrawParams.myThickness = 0.001;
            debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            PP.myDebugManager.draw(debugDrawParams, lifetime);
        }
    }
}