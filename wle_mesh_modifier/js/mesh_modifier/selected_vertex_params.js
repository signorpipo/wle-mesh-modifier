import { MeshAttribute } from "@wonderlandengine/api";
import { ColorUtils, getDebugVisualManager, vec3_create, vec4_create } from "../pp";
import { VertexUtils } from "./vertex_utils";

export function setSelectedVertexColor(color) {
    _selectedVertexColor = color;
}

export class SelectedVertexParams {
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
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let positionAttribute = this._myMeshComponent.mesh.attribute(MeshAttribute.Position);
        let vertexPosition = vec3_create();
        positionAttribute.get(this._myIndexes[0], vertexPosition);

        let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

        return vertexPositionWorld;
    }

    getNormal() {
        let normal = vec3_create();
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let normalAttribute = this._myMeshComponent.mesh.attribute(MeshAttribute.Normal);
        for (let vertexIndex of this._myIndexes) {
            let vertexNormal = vec3_create();
            normalAttribute.get(vertexIndex, vertexNormal);
            normal.vec3_add(vertexNormal, normal);
        }

        normal.vec3_normalize(normal);
        let normalWorld = normal.vec3_convertDirectionToWorld(meshTransform);
        normalWorld.vec3_normalize(normalWorld);

        return normalWorld;
    }

    getOriginalNormal() {
        let normal = vec3_create();
        let meshTransform = this._myMeshComponent.object.pp_getTransform();

        let normalAttribute = this._myMeshComponent.mesh.attribute(MeshAttribute.Normal);
        for (let vertexIndex of this._myIndexes) {
            let vertexNormal = vec3_create();
            normalAttribute.get(vertexIndex, vertexNormal);
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
            actualColor = ColorUtils.color255To1(vec4_create(_selectedVertexColor, _selectedVertexColor, _selectedVertexColor, 255));
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