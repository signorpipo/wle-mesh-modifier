WL.registerComponent('vertex_selector', {
    _mySelectedObject: { type: WL.Type.Object },
    _myPointer: { type: WL.Type.Object },
    _myMinDistanceToSelect: { type: WL.Type.Float, default: 0.025 }
}, {
    init: function () {

    },
    start: function () {
        this._myVertexDataBackup = [];
        for (let vertexData of this._mySelectedObject.pp_getComponentHierarchy("mesh").mesh.vertexData) {
            this._myVertexDataBackup.push(vertexData);
        }

        this._mySelectedVertexes = [];
        this._myPreviousPointerPosition = null;
    },
    update: function (dt) {
        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
            if (this._myPreviousPointerPosition == null) {
                this._myPreviousPointerPosition = this._myPointer.pp_getPosition();
            } else {
                let currentPointerPosition = this._myPointer.pp_getPosition();

                let difference = currentPointerPosition.vec3_sub(this._myPreviousPointerPosition);
                let movement = difference.vec3_length();
                if (movement > 0.00025) {
                    difference.vec3_normalize(difference);
                    difference.vec3_scale(movement, difference);
                    this._moveSelectedVertexes(this._mySelectedObject, difference);
                } else {
                    this._mySelectedObject.pp_getComponentHierarchy("mesh").active = true;
                }

                this._myPreviousPointerPosition = currentPointerPosition;
            }
        } else if (Math.abs(axes[0]) > 0.2) {
            this._myPreviousPointerPosition = null;
            let movement = axes[0] * 0.2 * dt;
            this._moveSelectedVertexesAlongNormals(this._mySelectedObject, movement);
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressed()) {
            this._myPreviousPointerPosition = null;
            this._resetSelectedVertexes(this._mySelectedObject, this._myPointer);
        } else if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd()) {
            this._myPreviousPointerPosition = null;
            this._resetAll(this._mySelectedObject);
        } else {
            this._myPreviousPointerPosition = null;
            this._mySelectedObject.pp_getComponentHierarchy("mesh").active = true;

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
                this._selectVertex(this._mySelectedObject, this._myPointer);
            }

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
                this._deselectVertex(this._mySelectedObject, this._myPointer);
            }

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
                this._mySelectedVertexes = [];
            }
        }

        this._debugDraw(this._mySelectedObject);
    },
    _selectVertex(meshObject, pointerObject) {
        let pointerPosition = pointerObject.pp_getPosition();

        let selectedVertexParams = this._getClosestSelectedVertex(meshObject, pointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    },
    _deselectVertex(meshObject, pointerObject) {
        let pointerPosition = pointerObject.pp_getPosition();

        let selectedVertexParams = this._getClosestSelectedVertex(meshObject, pointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    },
    _resetSelectedVertexes(meshObject, pointerObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let pointerPosition = pointerObject.pp_getPosition();

        let selectedVertexParams = this._getClosestSelectedVertex(meshObject, pointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            let mesh = meshComponent.mesh;
            let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

            let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
            for (let index of selectedVertexParams.getIndexes()) {
                let vertexPositionReset = [
                    this._myVertexDataBackup[index * vertexDataSize + WL.Mesh.POS.X],
                    this._myVertexDataBackup[index * vertexDataSize + WL.Mesh.POS.Y],
                    this._myVertexDataBackup[index * vertexDataSize + WL.Mesh.POS.Z]];

                positionAttribute.set(index, vertexPositionReset);

                mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.X] = vertexPositionReset[0];
                mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.Y] = vertexPositionReset[1];
                mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.Z] = vertexPositionReset[2];
            }

            meshComponent.active = false;
        } else {
            meshComponent.active = true;
        }
    },
    _resetAll(meshObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = this._myVertexDataBackup.length / vertexDataSize;
        for (let i = 0; i < vertexCount; i++) {
            let vertexPositionReset = [
                this._myVertexDataBackup[i * vertexDataSize + WL.Mesh.POS.X],
                this._myVertexDataBackup[i * vertexDataSize + WL.Mesh.POS.Y],
                this._myVertexDataBackup[i * vertexDataSize + WL.Mesh.POS.Z]];

            positionAttribute.set(i, vertexPositionReset);

            mesh.vertexData[i * vertexDataSize + WL.Mesh.POS.X] = vertexPositionReset[0];
            mesh.vertexData[i * vertexDataSize + WL.Mesh.POS.Y] = vertexPositionReset[1];
            mesh.vertexData[i * vertexDataSize + WL.Mesh.POS.Z] = vertexPositionReset[2];
        }

        meshComponent.active = false;
    },
    _moveSelectedVertexes(meshObject, movement) {
        if (this._mySelectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        let localMovement = movement.vec3_convertDirectionToLocal(meshTransform);
        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of this._mySelectedVertexes) {
            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(localMovement, vertexPosition);
            for (let index of indexes) {
                this._setVertexPosition(vertexPosition, index, mesh, positionAttribute);
            }
        }

        meshComponent.active = !meshComponent.active;
    },
    _moveSelectedVertexesAlongNormals(meshObject, movement) {
        if (this._mySelectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();

        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of this._mySelectedVertexes) {
            let normal = selectedVertex.getNormal().vec3_convertDirectionToLocal(meshTransform);
            let movementToApply = normal.vec3_scale(movement);

            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(movementToApply, vertexPosition);
            for (let index of indexes) {
                this._setVertexPosition(vertexPosition, index, mesh, positionAttribute);
            }
        }

        meshComponent.active = !meshComponent.active;
    },
    _getClosestSelectedVertex(meshObject, pointerObject) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();
        let pointerPosition = pointerObject.pp_getPosition();

        let closestVertexIndex = this._getClosestVertexIndex(meshComponent.mesh, meshTransform, pointerPosition);
        let selectedVertexIndexes = this._getSameVertexIndexes(meshComponent.mesh, closestVertexIndex);

        return new SelectedVertexParams(meshComponent, selectedVertexIndexes);
    },
    _getClosestVertexIndex(mesh, meshTransform, position) {
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
    _setVertexPosition(position, vertexIndex, mesh, positionAttribute) {
        positionAttribute.set(vertexIndex, position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.X] = position[0];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Y] = position[1];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Z] = position[2];
    },
    _debugDraw() {
        for (let selectedVertex of this._mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
});

class SelectedVertexParams {
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

    debugDraw(lifetime = 0) {
        let meshTransform = this._myMeshComponent.object.pp_getTransform();
        let vertexPositionWorld = this.getPosition(meshTransform);
        {
            let debugDrawParams = new PP.VisualPointParams();
            debugDrawParams.myPosition = vertexPositionWorld;
            debugDrawParams.myRadius = 0.0035;
            debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            PP.myDebugVisualManager.draw(debugDrawParams, lifetime);
        }

        let vertexNormalWorld = this.getNormal(meshTransform);
        {
            let debugDrawParams = new PP.VisualPointParams();
            debugDrawParams.myStart = vertexPositionWorld;
            debugDrawParams.myDirection = vertexNormalWorld;
            debugDrawParams.myLength = 0.05;
            debugDrawParams.myThickness = 0.0015;
            debugDrawParams.myColor = PP.ColorUtils.color255To1([20, 20, 20, 255]);
            PP.myDebugVisualManager.draw(debugDrawParams, lifetime);
        }
    }
}