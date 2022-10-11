VertexUtils = {
    getClosestSelectedVertex: function (meshObject, pointerPosition, originalMeshVertexData) {
        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();

        let closestVertexIndex = VertexUtils.getClosestVertexIndex(meshComponent.mesh, meshTransform, pointerPosition);
        let selectedVertexIndexes = VertexUtils.getSameVertexIndexes(meshComponent.mesh, closestVertexIndex);

        return new SelectedVertexParams(meshComponent, selectedVertexIndexes, originalMeshVertexData);
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
    getVertexPosition: function (vertexIndex, mesh) {
        let position = [0, 0, 0];

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        position[0] = mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.X];
        position[1] = mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Y];
        position[2] = mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.POS.Z];

        return position;
    },
    setVertexNormal: function (normal, vertexIndex, mesh, normalAttribute) {
        normalAttribute.set(vertexIndex, normal);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.X] = normal[0];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.Y] = normal[1];
        mesh.vertexData[vertexIndex * vertexDataSize + WL.Mesh.NORMAL.Z] = normal[2];
    },
    resetMeshVertexData(meshComponent, originalVertexData) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);
        let normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = originalVertexData.length / vertexDataSize;
        for (let index = 0; index < vertexCount; index++) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.X],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Z]];

            let vertexNormalReset = [
                originalVertexData[index * vertexDataSize + WL.Mesh.NORMAL.X],
                originalVertexData[index * vertexDataSize + WL.Mesh.NORMAL.Y],
                originalVertexData[index * vertexDataSize + WL.Mesh.NORMAL.Z]];

            VertexUtils.setVertexPosition(vertexPositionReset, index, mesh, positionAttribute);
            VertexUtils.setVertexNormal(vertexNormalReset, index, mesh, normalAttribute);
        }
    },
    resetMeshIndexData(meshComponent, originalIndexData) {
        let mesh = meshComponent.mesh;
        mesh.indexData.pp_copy(originalIndexData);
    },
    resetVertexes(meshComponent, vertexIndexList, originalVertexData, isFlatShading) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        for (let index of vertexIndexList) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.X],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + WL.Mesh.POS.Z]];

            VertexUtils.setVertexPosition(vertexPositionReset, index, mesh, positionAttribute);

            VertexUtils.updateVertexNormals(index, mesh, isFlatShading);
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
    moveSelectedVertexesAlongNormals(meshObject, selectedVertexes, movement, useOriginalNormals) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponentHierarchy("mesh");
        let meshTransform = meshComponent.object.pp_getTransform();

        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of selectedVertexes) {
            let normal = null;
            if (useOriginalNormals) {
                normal = selectedVertex.getOriginalNormal();
            } else {
                normal = selectedVertex.getNormal();
            }
            normal.vec3_convertDirectionToLocal(meshTransform, normal);

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
    deleteSelectedVertexesFromIndexData(meshComponent, selectedVertexes) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let trianglesIndex = [];
        for (let selectedVertex of selectedVertexes) {
            for (let vertexIndex of selectedVertex.getIndexes()) {
                let triangles = VertexUtils.getVertexTrianglesIndexData(vertexIndex, meshComponent.mesh);
                for (let triangle of triangles) {
                    trianglesIndex.pp_pushUnique(triangle[0]);
                    trianglesIndex.pp_pushUnique(triangle[1]);
                    trianglesIndex.pp_pushUnique(triangle[2]);
                }
            }
        }

        VertexUtils.deleteMeshIndexesFromIndexData(meshComponent.mesh, trianglesIndex);
    },
    deleteMeshIndexesFromIndexData(mesh, indexesToDelete) {
        let indexDataArray = [];
        for (let index = 0; index < mesh.indexData.length; index++) {
            if (!indexesToDelete.pp_hasEqual(index)) {
                indexDataArray.push(mesh.indexData[index]);
            }
        }

        let newIndexData = new Uint32Array(indexDataArray.length);
        newIndexData.pp_copy(indexDataArray);
        mesh.indexData = newIndexData;
    },
    getIndexDataAfterDeleteSelectedVertexes(meshComponent, selectedVertexes) {
        let indexesToDelete = [];
        for (let selectedVertex of selectedVertexes) {
            for (let vertexIndex of selectedVertex.getIndexes()) {
                let triangles = VertexUtils.getVertexTrianglesIndexData(vertexIndex, meshComponent.mesh);
                for (let triangle of triangles) {
                    indexesToDelete.pp_pushUnique(triangle[0]);
                    indexesToDelete.pp_pushUnique(triangle[1]);
                    indexesToDelete.pp_pushUnique(triangle[2]);
                }
            }
        }

        let indexDataArray = [];
        for (let index = 0; index < meshComponent.mesh.indexData.length; index++) {
            if (!indexesToDelete.pp_hasEqual(index)) {
                indexDataArray.push(meshComponent.mesh.indexData[index]);
            }
        }

        let newIndexData = new Uint32Array(indexDataArray.length);
        newIndexData.pp_copy(indexDataArray);

        return newIndexData;
    },
    hideSelectedVertexesFromIndexData(meshComponent, selectedVertexes) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let trianglesIndex = [];
        for (let selectedVertex of selectedVertexes) {
            for (let vertexIndex of selectedVertex.getIndexes()) {
                let triangles = VertexUtils.getVertexTrianglesIndexData(vertexIndex, meshComponent.mesh);
                for (let triangle of triangles) {
                    trianglesIndex.pp_pushUnique(triangle[0]);
                    trianglesIndex.pp_pushUnique(triangle[1]);
                    trianglesIndex.pp_pushUnique(triangle[2]);
                }
            }
        }

        VertexUtils.hideMeshIndexesFromIndexData(meshComponent.mesh, trianglesIndex);
    },
    hideMeshIndexesFromIndexData(mesh, indexDataIndexesToHide) {
        for (let indexDataIndexToHide of indexDataIndexesToHide) {
            mesh.indexData[indexDataIndexToHide] = 0;
        }
    },
    updateVertexNormalsActive: true,
    updateVertexNormals(vertexIndex, mesh, isFlatShading) {
        if (!VertexUtils.updateVertexNormalsActive) return;

        if (isFlatShading) {
            let sameVertexIndex = VertexUtils.getSameVertexIndexes(mesh, vertexIndex);
            for (let vertexIndex of sameVertexIndex) {
                VertexUtils.updateVertexNormalFlat(vertexIndex, mesh);
            }
        } else {
            VertexUtils.updateVertexNormalSmooth(vertexIndex, mesh, true);
        }
    },
    updateVertexNormalFlat: function (vertexIndex, mesh) {
        // if flat take all the triangles in the "flat chunk" and compute the average normal and set it for every vertex
        let processedVertexIndexList = [];
        let vertexIndexListToProcess = [vertexIndex];
        let triangles = [];

        while (vertexIndexListToProcess.length > 0) {
            let currentVertexIndex = vertexIndexListToProcess.shift();
            let currentTriangles = VertexUtils.getVertexTrianglesVertexData(currentVertexIndex, mesh);
            for (let i = 0; i < currentTriangles.length; i++) {
                let triangle = currentTriangles[i];
                for (let triangleIndex of triangle) {
                    if (!processedVertexIndexList.pp_hasEqual(triangleIndex)) {
                        vertexIndexListToProcess.pp_pushUnique(triangleIndex);
                    }
                }

                triangles.pp_pushUnique(triangle, element => element.pp_equals(triangle));
            }

            processedVertexIndexList.push(currentVertexIndex);
        }

        let normal = [0, 0, 0];
        for (let i = 0; i < triangles.length; i++) {
            let triangle = triangles[i];
            normal.vec3_add(VertexUtils.computeTriangleNormal(mesh, triangle), normal);
        }

        normal.vec3_normalize(normal);

        let normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);
        for (let currentVertexIndex of processedVertexIndexList) {
            VertexUtils.setVertexNormal(normal, currentVertexIndex, mesh, normalAttribute);
        }
    },
    updateVertexNormalSmooth: function (vertexIndex, mesh, updateAllTriangles) {
        // if smooth, vertexIndexList is supposed to be the list of all the vertexes in the same position
        // take all the triangles of all those vertexes and smooth all their normals

        let sameVertexIndex = VertexUtils.getSameVertexIndexes(mesh, vertexIndex);
        let triangles = [];
        for (let vertexIndex of sameVertexIndex) {
            let currentTriangles = VertexUtils.getVertexTrianglesVertexData(vertexIndex, mesh);
            triangles.push(...currentTriangles);
        }

        if (updateAllTriangles) {
            let allVertexesToUpdate = [];
            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                allVertexesToUpdate.pp_pushUnique(triangle[0]);
                allVertexesToUpdate.pp_pushUnique(triangle[1]);
                allVertexesToUpdate.pp_pushUnique(triangle[2]);
            }

            for (let vertexIndex of allVertexesToUpdate) {
                VertexUtils.updateVertexNormalSmooth(vertexIndex, mesh, false);
            }
        } else {
            let normal = [0, 0, 0];
            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                normal.vec3_add(VertexUtils.computeTriangleNormal(mesh, triangle), normal);
            }

            normal.vec3_normalize(normal);

            let normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);
            VertexUtils.setVertexNormal(normal, vertexIndex, mesh, normalAttribute);
        }
    },
    computeTriangleNormal(mesh, triangle) {
        let firstVertexPosition = VertexUtils.getVertexPosition(triangle[0], mesh);
        let secondVertexPosition = VertexUtils.getVertexPosition(triangle[1], mesh);
        let thirdVertexPosition = VertexUtils.getVertexPosition(triangle[2], mesh);

        let firstEdge = secondVertexPosition.vec3_sub(firstVertexPosition);
        let secondEdge = thirdVertexPosition.vec3_sub(secondVertexPosition);

        let normal = firstEdge.vec3_cross(secondEdge).vec3_normalize();

        return normal;
    },
    getVertexTrianglesVertexData(vertexIndex, mesh) {
        let triangles = [];

        let vertexIndexDataIndexList = mesh.indexData.pp_findAllIndexesEqual(vertexIndex);

        for (let vertexIndexDataIndex of vertexIndexDataIndexList) {
            let startVertex = vertexIndexDataIndex - vertexIndexDataIndex % 3;
            triangles.push([mesh.indexData[startVertex], mesh.indexData[startVertex + 1], mesh.indexData[startVertex + 2]]);
        }

        return triangles;
    },
    getVertexTrianglesIndexData(vertexIndex, mesh) {
        let triangles = [];

        let vertexIndexDataIndexList = mesh.indexData.pp_findAllIndexesEqual(vertexIndex);

        for (let vertexIndexDataIndex of vertexIndexDataIndexList) {
            let startVertex = vertexIndexDataIndex - vertexIndexDataIndex % 3;
            triangles.push([startVertex, startVertex + 1, startVertex + 2]);
        }

        return triangles;
    }
};

selectedVertexColor = 46;
SelectedVertexParams = class SelectedVertexParams {
    constructor(meshComponent, indexes, originalMeshVertexData) {
        this._myMeshComponent = meshComponent;
        this._myIndexes = indexes;
        this._myOriginalMeshVertexData = originalMeshVertexData;
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

    getOriginalNormal() {
        let normal = [0, 0, 0];
        let meshVertexes = this._myOriginalMeshVertexData;
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

    debugDraw(color = null, isPreview = false) {
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let actualColor = color;
        if (color == null) {
            actualColor = PP.ColorUtils.color255To1([selectedVertexColor, selectedVertexColor, selectedVertexColor, 255]);
        }

        let vertexPositionWorld = this.getPosition(meshTransform);
        let vertexSize = isPreview ? 0.002 : 0.0035;
        PP.myDebugVisualManager.drawPoint(0, vertexPositionWorld, actualColor, vertexSize);

        if (false) {
            let vertexNormalWorld = this.getOriginalNormal(meshTransform);
            PP.myDebugVisualManager.drawArrow(0, vertexPositionWorld, vertexNormalWorld, 0.05, actualColor, 0.0015);
        }
    }
};