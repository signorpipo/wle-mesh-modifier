import { Mesh, MeshAttribute, MeshComponent } from "@wonderlandengine/api";
import { vec3_create, vec4_create } from "../pp";
import { SelectedVertexParams } from "./selected_vertex_params";

export let VertexUtils = {
    getClosestSelectedVertex: function (meshObject, pointerPosition, originalMeshVertexData) {
        let meshComponent = meshObject.pp_getComponent(MeshComponent);
        let meshTransform = meshComponent.object.pp_getTransform();

        let closestVertexIndex = VertexUtils.getClosestVertexIndex(meshComponent.mesh, meshTransform, pointerPosition);
        let selectedVertexIndexes = VertexUtils.getSameVertexIndexes(meshComponent.mesh, closestVertexIndex);

        return new SelectedVertexParams(meshComponent, selectedVertexIndexes, originalMeshVertexData);
    },
    getClosestVertexIndex: function (mesh, meshTransform, position, indexToIgnore = []) {
        let minDistance = -1;
        let vertexIndex = -1;

        let vertexCount = mesh.vertexCount;
        for (let i = 0; i < vertexCount; i++) {
            if (indexToIgnore.pp_hasEqual(i)) continue;

            let vertexPosition = VertexUtils.getVertexPosition(i, mesh);
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
        let sameVertexIndexes = [];
        let closestVertexPosition = VertexUtils.getVertexPosition(vertexIndex, mesh);

        let vertexCount = mesh.vertexCount;
        for (let i = 0; i < vertexCount; i++) {
            let vertexPosition = VertexUtils.getVertexPosition(i, mesh);

            if (closestVertexPosition.pp_equals(vertexPosition)) {
                sameVertexIndexes.push(i);
            }
        }

        return sameVertexIndexes;
    },
    setVertexPositionWithAttribute: function (position, vertexIndex, positionAttribute) {
        positionAttribute.set(vertexIndex, position);
    },
    getVertexPosition: function (vertexIndex, mesh) {
        let vertexPosition = vec3_create();

        let positionAttribute = mesh.attribute(MeshAttribute.Position);
        positionAttribute.get(vertexIndex, vertexPosition);

        return vertexPosition;
    },
    getVertexNormal: function (vertexIndex, mesh) {
        let vertexNormal = vec3_create();

        let positionAttribute = mesh.attribute(MeshAttribute.Normal);
        positionAttribute.get(vertexIndex, vertexNormal);

        return vertexNormal;
    },
    setVertexNormalWithAttribute: function (normal, vertexIndex, normalAttribute) {
        normalAttribute.set(vertexIndex, normal);
    },
    getJointWeight: function (vertexIndex, mesh) {
        let jointWeight = vec4_create();

        try {
            let jointWeightAttribute = mesh.attribute(MeshAttribute.JointWeight);
            jointWeightAttribute.get(vertexIndex, jointWeight);
        } catch (e) { }

        return jointWeight;
    },
    setJointWeight: function (jointWeight, vertexIndex, mesh) {
        try {
            let jointWeightAttribute = mesh.attribute(MeshAttribute.JointWeight);
            jointWeightAttribute.set(vertexIndex, jointWeight);
        } catch (e) { }
    },
    getJointID: function (vertexIndex, mesh) {
        let jointID = [0, 0, 0, 0];

        try {
            let jointIDAttribute = mesh.attribute(MeshAttribute.JointId);
            jointIDAttribute.get(vertexIndex, jointID);
        } catch (e) { }

        return jointID;
    },
    setJointID: function (jointID, vertexIndex, mesh) {
        try {
            let jointIDAttribute = mesh.attribute(MeshAttribute.JointId);
            jointIDAttribute.set(vertexIndex, jointID);
        } catch (e) { }
    },
    resetMeshVertexData(meshComponent, originalVertexData) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(MeshAttribute.Position);
        let normalAttribute = mesh.attribute(MeshAttribute.Normal);

        let vertexDataSize = Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = originalVertexData.length / vertexDataSize;
        for (let index = 0; index < vertexCount; index++) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + Mesh.POS.X],
                originalVertexData[index * vertexDataSize + Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + Mesh.POS.Z]];

            let vertexNormalReset = [
                originalVertexData[index * vertexDataSize + Mesh.NORMAL.X],
                originalVertexData[index * vertexDataSize + Mesh.NORMAL.Y],
                originalVertexData[index * vertexDataSize + Mesh.NORMAL.Z]];

            VertexUtils.setVertexPositionWithAttribute(vertexPositionReset, index, positionAttribute);
            VertexUtils.setVertexNormalWithAttribute(vertexNormalReset, index, normalAttribute);
        }
    },
    resetMeshIndexData(meshComponent, originalIndexData) {
        let mesh = meshComponent.mesh;
        mesh.indexData.pp_copy(originalIndexData);
    },
    resetVertexes(meshComponent, vertexIndexList, originalVertexData, isFlatShading) {
        let mesh = meshComponent.mesh;
        let positionAttribute = mesh.attribute(MeshAttribute.Position);

        let vertexDataSize = Mesh.VERTEX_FLOAT_SIZE;
        for (let index of vertexIndexList) {
            let vertexPositionReset = [
                originalVertexData[index * vertexDataSize + Mesh.POS.X],
                originalVertexData[index * vertexDataSize + Mesh.POS.Y],
                originalVertexData[index * vertexDataSize + Mesh.POS.Z]];

            VertexUtils.setVertexPositionWithAttribute(vertexPositionReset, index, positionAttribute);

            VertexUtils.updateVertexNormals(index, mesh, isFlatShading);
        }
    },
    moveSelectedVertexes(meshObject, selectedVertexes, movement) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponent(MeshComponent);
        let meshTransform = meshComponent.object.pp_getTransform();
        let localMovement = movement.vec3_convertDirectionToLocal(meshTransform);
        let vertexPosition = [0, 0, 0];
        for (let selectedVertex of selectedVertexes) {
            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            let positionAttribute = mesh.attribute(MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(localMovement, vertexPosition);
            for (let index of indexes) {
                VertexUtils.setVertexPositionWithAttribute(vertexPosition, index, positionAttribute);
            }
        }
    },
    moveSelectedVertexesAlongNormals(meshObject, selectedVertexes, movement, useOriginalNormals) {
        if (selectedVertexes.length == 0) {
            return;
        }

        let meshComponent = meshObject.pp_getComponent(MeshComponent);
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

            let positionAttribute = mesh.attribute(MeshAttribute.Position);

            positionAttribute.get(indexes[0], vertexPosition);
            vertexPosition.vec3_add(movementToApply, vertexPosition);
            for (let index of indexes) {
                VertexUtils.setVertexPositionWithAttribute(vertexPosition, index, positionAttribute);
            }
        }
    },
    changeSelectedVertexesWeight(meshObject, selectedVertexes, amount) {
        if (selectedVertexes.length == 0) {
            return;
        }

        for (let selectedVertex of selectedVertexes) {
            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            for (let index of indexes) {
                let jointWeight = VertexUtils.getJointWeight(index, mesh);

                for (let i = 0; i < 4; i++) {
                    if (jointWeight[i] != 0) {
                        jointWeight[i] = jointWeight[i] + amount;
                    }
                }

                VertexUtils.setJointWeight(jointWeight, index, mesh);
            }
        }
    },
    increaseSelectedVertexesJointID(selectedVertexes, sign) {
        if (selectedVertexes.length == 0) {
            return;
        }

        for (let selectedVertex of selectedVertexes) {
            let mesh = selectedVertex.getMesh();
            let indexes = selectedVertex.getIndexes();

            for (let index of indexes) {
                let jointID = VertexUtils.getJointID(index, mesh);

                for (let i = 0; i < 4; i++) {
                    if (jointID[i] != 0) {
                        jointID[i] = jointID[i] + 1 * sign;
                    }
                }

                VertexUtils.setJointID(jointID, index, mesh);
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

        let normalAttribute = mesh.attribute(MeshAttribute.Normal);
        for (let currentVertexIndex of processedVertexIndexList) {
            VertexUtils.setVertexNormalWithAttribute(normal, currentVertexIndex, normalAttribute);
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

            let normalAttribute = mesh.attribute(MeshAttribute.Normal);
            VertexUtils.setVertexNormalWithAttribute(normal, vertexIndex, normalAttribute);
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