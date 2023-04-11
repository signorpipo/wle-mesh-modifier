import { MeshAttribute } from "@wonderlandengine/api";
import { ColorUtils, getDebugVisualManager, vec4_create } from "../pp";
import { VertexUtils } from "./vertex_utils";

export function setSelectedVertexColor(color) {
    _selectedVertexColor = color;
}

export class SelectedVertexParams {
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
        let vertexPosition = VertexUtils.getVertexPosition(this._myIndexes[0], this._myMeshComponent.mesh);

        let meshTransform = this._myMeshComponent.object.pp_getTransform();
        let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

        return vertexPositionWorld;
    }

    getNormal() {
        let normal = [0, 0, 0];
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        for (let vertexIndex of this._myIndexes) {
            let vertexNormal = VertexUtils.getVertexNormal(vertexIndex, this._myMeshComponent.mesh);

            normal.vec3_add(vertexNormal, normal);
        }

        normal.vec3_normalize(normal);
        let normalWorld = normal.vec3_convertDirectionToWorld(meshTransform);
        normalWorld.vec3_normalize(normalWorld);

        return normalWorld;
    }

    getOriginalNormal() {
        let normal = [0, 0, 0];
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        for (let vertexIndex of this._myIndexes) {
            let vertexNormal = VertexUtils.getVertexNormal(vertexIndex, this._myMeshComponent.mesh);

            normal.vec3_add(vertexNormal, normal);
        }

        normal.vec3_normalize(normal);
        let normalWorld = normal.vec3_convertDirectionToWorld(meshTransform);
        normalWorld.vec3_normalize(normalWorld);

        return normalWorld;
    }

    debugInfo() {
        try {
            let jointWeight = vec4_create();

            let jointWeightAttribute = this._myMeshComponent.mesh.attribute(MeshAttribute.JointWeight);
            jointWeightAttribute.get(this._myIndexes[0], jointWeight);

            jointWeight.vec_error();

            let jointID = VertexUtils.getJointID(this._myIndexes[0], this._myMeshComponent.mesh);
            jointID.vec_error();
        } catch (error) {
        }
    }

    equals(other) {
        return this._myMeshComponent.mesh._index == other._myMeshComponent.mesh._index && this._myIndexes.pp_equals(other._myIndexes);
    }

    debugDraw(color = null, isPreview = false) {
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let actualColor = color;
        if (color == null) {
            actualColor = ColorUtils.color255To1([selectedVertexColor, selectedVertexColor, selectedVertexColor, 255]);
        }

        let vertexPositionWorld = this.getPosition(meshTransform);
        let vertexSize = isPreview ? 0.002 : 0.0035;
        getDebugVisualManager().drawPoint(0, vertexPositionWorld, actualColor, vertexSize);

        if (false) {
            let vertexNormalWorld = this.getOriginalNormal(meshTransform);
            getDebugVisualManager().drawArrow(0, vertexPositionWorld, vertexNormalWorld, 0.05, actualColor, 0.0015);
        }
    }
}



let _selectedVertexColor = 46;