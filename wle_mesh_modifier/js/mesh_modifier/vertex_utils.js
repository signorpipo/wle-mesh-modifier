VertexUtils = {
    getClosestSelectedVertex: function (meshObject, pointerObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        let pointerPosition = pointerObject.pp_getPosition();

        let closestVertexIndex = VertexUtils.getClosestVertexIndex(meshComponent.mesh, meshTransform, pointerPosition);
        let selectedVertexIndexes = VertexUtils.getSameVertexIndexes(meshComponent.mesh, closestVertexIndex);

        return new SelectedVertexParams(meshComponent, selectedVertexIndexes);
    },
    getClosestVertexIndex: function (mesh, meshTransform, position) {
        let meshVertexes = mesh.vertexData;

        let minDistance = -1;
        let vertexIndex = -1;
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
    getSameVertexIndexes: function (mesh, vertexIndex) {
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
    setVertexPosition: function (position, vertexIndex, mesh, positionAttribute) {
        positionAttribute.set(vertexIndex, position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.X] = position[0];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Y] = position[1];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Z] = position[2];
    },
    resetMesh(meshComponent, originalVertexData) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = originalVertexData.length / vertexDataSize;
        for (let index = 0; index < vertexCount; index++) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.X],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Z]];


            VertexUtils.setVertexPosition(vertexPositionReset, index, mesh, positionAttribute);
        }
    },
    resetVertexes(meshComponent, vertexIndexList, originalVertexData) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        for (let index of vertexIndexList) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.X],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Z]];


            VertexUtils.setVertexPosition(vertexPositionReset, index, mesh, positionAttribute);
        }
    },
    moveSelectedVertexes(meshObject, selectedVertexes, movement) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        let localMovement = movement.vec3_convertDirectionToLocal(meshTransform);
        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of selectedVertexes) {
            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(localMovement, vertexPosition);
            for (let index of indexes) {
                VertexUtils.setVertexPosition(vertexPosition, index, mesh, positionAttribute);
            }
        }
    },
    moveSelectedVertexesAlongNormals(meshObject, selectedVertexes, movement) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();

        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of selectedVertexes) {
            let normal = selectedVertex.getNormal().vec3_convertDirectionToLocal(meshTransform);
            let movementToApply = normal.vec3_scale(movement);

            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(movementToApply, vertexPosition);
            for (let index of indexes) {
                VertexUtils.setVertexPosition(vertexPosition, index, mesh, positionAttribute);
            }
        }
    },
};


SelectedVertexParams = class SelectedVertexParams {
    constructor(meshComponent, indexes) {
        this._myMeshComponent = meshComponent;
        this._myIndexes = indexes;
    }

    getMeshComponent() {
        return this._myMeshComponent;
    }

    getMesh() {
        return this._myMeshComponent.mesh;
    }

    getIndexes() {
        return this._myIndexes;
    }

    getPosition() {
        let meshVertexes = this._myMeshComponent.mesh.vertexData;
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexPosition = [
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.X],
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.Y],
            meshVertexes[this._myIndexes[0] * vertexDataSize + WL.Mesh.POS.Z]];
        let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

        return vertexPositionWorld;
    }

    getNormal() {
        let normal = [0, 0, 0];
        let meshVertexes = this._myMeshComponent.mesh.vertexData;
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

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
        normalWorld.vec3_normalize(normalWorld);

        return normalWorld;
    }

    equals(other) {
        return this._myMeshComponent.mesh._index == other._myMeshComponent.mesh._index && this._myIndexes.pp_equals(other._myIndexes);
    }

    debugDraw(color = null) {
        let meshTransform = this._myMeshComponent.object.pp_getTransform();
        let vertexPositionWorld = this.getPosition(meshTransform);
        {
            let debugDrawParams = new PP.DebugPointParams();
            debugDrawParams.myPosition = vertexPositionWorld;
            debugDrawParams.myRadius = 0.0035;
            if (color != null) {
                debugDrawParams.myColor = color;
            } else {
                debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            }
            PP.myDebugManager.draw(debugDrawParams, 0);
        }

        let vertexNormalWorld = this.getNormal(meshTransform);
        {
            let debugDrawParams = new PP.DebugArrowParams();
            debugDrawParams.myStart = vertexPositionWorld;
            debugDrawParams.myDirection = vertexNormalWorld;
            debugDrawParams.myLength = 0.05;
            debugDrawParams.myThickness = 0.0015;
            if (color != null) {
                debugDrawParams.myColor = color;
            } else {
                debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            }
            PP.myDebugManager.draw(debugDrawParams, 0);
        }
    }
};