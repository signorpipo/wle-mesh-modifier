import { MeshAttribute } from "@wonderlandengine/api";
import { getDebugVisualManager, mat4_create } from "../pp";
import { randomColor } from "./cauldron_utils";
import { VertexUtils } from "./vertex_utils";

export class MeshVariantSetup {
    constructor() {
        this._myVariantSetupMap = new Map();
    }

    setGroupVariant(groupID, variantID) {
        this._myVariantSetupMap.set(groupID, variantID);
    }

    getVariantSetupMap() {
        return this._myVariantSetupMap;
    }
}

export class VertexGroupConfig {
    constructor() {
        this._myNextGroupID = 0;
        this._myVertexGroups = new Map();
    }

    loadVariantSetup(mesh, meshVariantSetup, isFlatShading) {
        let variantSetupMap = meshVariantSetup.getVariantSetupMap();

        for (let entry of variantSetupMap.entries()) {
            let group = this.getGroup(entry[0]);
            if (group != null) {
                group.loadVariant(mesh, entry[1], isFlatShading);
            }
        }
    }

    addGroup() {
        let newGroupID = this._myNextGroupID;
        this._myNextGroupID++;
        let group = new VertexGroup(newGroupID);
        this._myVertexGroups.set(newGroupID, group);

        return group;
    }

    removeGroup(id) {
        this._myVertexGroups.delete(id);
    }

    getGroup(id) {
        let group = this._myVertexGroups.get(id);
        return group;
    }

    getGroups() {
        let values = [];
        for (let value of this._myVertexGroups.values()) {
            values.push(value);
        }
        return values;
    }

    fromJSONObject(jsonObject) {
        this._myNextGroupID = jsonObject._myNextGroupID;
        this._myVertexGroups.clear();
        for (let jsonVertexGroup of jsonObject._myVertexGroups.values()) {
            let vertexGroup = new VertexGroup(0);
            vertexGroup.fromJSONObject(jsonVertexGroup);

            this._myVertexGroups.set(vertexGroup.getID(), vertexGroup);
        }
    }

    remapToMesh(fromMesh, toMesh, fromToTransform = mat4_create().mat4_identity()) {
        let resultGroupConfig = new VertexGroupConfig();

        let fromIndexAlreadyProcessed = [];
        let toIndexAlreadyProcessed = [];

        for (let [groupID, group] of this._myVertexGroups.entries()) {
            let resultGroup = group.remapToMesh(fromMesh, toMesh, fromIndexAlreadyProcessed, toIndexAlreadyProcessed, fromToTransform);
            resultGroupConfig._myVertexGroups.set(groupID, resultGroup);
        }

        resultGroupConfig._myNextGroupID = this._myNextGroupID;

        return resultGroupConfig;
    }

    debugDraw(meshComponent) {
        for (let group of this._myVertexGroups.values()) {
            group.debugDraw(meshComponent);
        }
    }
}

export class VertexGroup {
    constructor(id) {
        this._myID = id;
        this._myIndexList = [];

        this._myNextVariantID = 0;
        this._myVariants = new Map();
    }

    getID() {
        return this._myID;
    }

    getIndexList() {
        return this._myIndexList;
    }

    setIndexList(indexList) {
        this._myIndexList = indexList;
        for (let variant of this._myVariants.values()) {
            variant.clean(this._myIndexList);
        }
    }

    getNextVariant(variant, direction) {
        let nextVariant = null;

        if (variant == null) {
            if (this._myVariants.size > 0) {
                let values = [];
                for (let value of this._myVariants.values()) {
                    values.push(value);
                }

                return (direction >= 0) ? values[0] : values[values.length - 1];
            }
        } else {
            let values = [];
            for (let value of this._myVariants.values()) {
                values.push(value);
            }

            let index = values.pp_findIndexEqual(variant);
            if (index >= 0) {
                index += direction;
                if (index >= 0 && index < values.length) {

                    nextVariant = values[index];
                }
            }
        }

        return nextVariant;
    }

    getVariantIDs() {
        let values = [];
        for (let value of this._myVariants.keys()) {
            values.push(value);
        }
        return values;
    }

    removeVariant(variantID) {
        this._myVariants.delete(variantID);
    }

    addIndex(index) {
        this._myIndexList.pp_pushUnique(index);
    }

    removeIndex(index) {
        this._myIndexList.pp_removeEqual(index);
        let variants = this._myVariants.values();
        for (let variant of variants) {
            variant.removeIndex(variant);
        }
    }

    retrieveVariant(mesh) {
        let currentVariant = null;

        for (let variant of this._myVariants.values()) {
            if (variant.matchMesh(mesh)) {
                currentVariant = variant;
                break;
            }
        }

        return currentVariant;
    }

    saveVariant(mesh, variantID = null) {
        let variant = null;
        if (variantID != null) {
            variant = this._myVariants.get(variantID);
            if (variant) {
                variant.saveVariant(mesh, this._myIndexList);
            }
        } else {
            let newVariantID = this._myNextVariantID;
            this._myNextVariantID++;

            variant = new VertexGroupVariant(newVariantID);
            variant.saveVariant(mesh, this._myIndexList);
            this._myVariants.set(newVariantID, variant);
        }

        return variant;
    }

    loadVariant(mesh, variantID, isFlatShading) {
        let variant = this._myVariants.get(variantID);
        if (variant) {
            variant.loadVariant(mesh, isFlatShading);
        }
    }

    fromJSONObject(jsonObject) {
        this._myID = jsonObject._myID;
        this._myIndexList = jsonObject._myIndexList;
        this._myNextVariantID = jsonObject._myNextVariantID;

        this._myVariants.clear();
        for (let jsonVariants of jsonObject._myVariants.values()) {
            let variant = new VertexGroupVariant(0);
            variant.fromJSONObject(jsonVariants);

            this._myVariants.set(variant.getID(), variant);
        }
    }

    remapToMesh(fromMesh, toMesh, fromIndexAlreadyProcessed, toIndexAlreadyProcessed, fromToTransform = mat4_create().mat4_identity()) {
        let resultGroup = new VertexGroup(this._myID);
        let identityTransform = mat4_create().mat4_identity();

        for (let [variantID, variant] of this._myVariants.entries()) {
            resultGroup._myVariants.set(variantID, new VertexGroupVariant(variantID));
        }
        resultGroup._myNextVariantID = this._myNextVariantID;

        for (let index of this._myIndexList) {
            if (fromIndexAlreadyProcessed.pp_hasEqual(index)) continue;
            let fromVertexIndexList = VertexUtils.getSameVertexIndexes(fromMesh, index);
            for (let indexFromList of fromVertexIndexList) {
                fromIndexAlreadyProcessed.pp_pushUnique(indexFromList);
            }

            let fromVertexPosition = VertexUtils.getVertexPosition(index, fromMesh);
            let fromVertexPositionTransformed = fromVertexPosition.vec3_convertPositionToWorld(fromToTransform);
            let toVertexIndex = VertexUtils.getClosestVertexIndex(toMesh, identityTransform, fromVertexPositionTransformed, toIndexAlreadyProcessed);
            if (toVertexIndex == -1) {
                toVertexIndex = VertexUtils.getClosestVertexIndex(toMesh, identityTransform, fromVertexPositionTransformed);
            }
            let toVertexIndexList = VertexUtils.getSameVertexIndexes(toMesh, toVertexIndex);

            for (let indexFromList of toVertexIndexList) {
                toIndexAlreadyProcessed.pp_pushUnique(indexFromList);
            }

            let resultIndexListLengthBeforeAdd = resultGroup._myIndexList.length;
            for (let toIndex of toVertexIndexList) {
                resultGroup.addIndex(toIndex);
            }

            let newIndexAdded = resultIndexListLengthBeforeAdd != resultGroup._myIndexList.length;
            if (newIndexAdded) {
                for (let [variantID, variant] of this._myVariants.entries()) {
                    let resultVariant = resultGroup._myVariants.get(variantID);

                    let fromVertexVariantPosition = variant.getPosition(index);
                    let fromVertexVariantPositionTransformed = fromVertexVariantPosition.vec3_convertPositionToWorld(fromToTransform);
                    for (let toIndex of toVertexIndexList) {
                        resultVariant.setPosition(toIndex, fromVertexVariantPositionTransformed);
                    }
                }
            }
        }

        return resultGroup;
    }

    debugDraw(meshComponent) {
        let meshTransform = meshComponent.object.pp_getTransform();
        let mesh = meshComponent.mesh;

        let color = randomColor(this._myID);

        for (let vertexIndex of this._myIndexList) {
            let vertexPosition = VertexUtils.getVertexPosition(vertexIndex, mesh);
            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

            getDebugVisualManager().drawPoint(0, vertexPositionWorld, color, 0.002);
        }
    }
}

export class VertexGroupVariant {
    constructor(id) {
        this._myID = id;
        this._myPositionMap = new Map();
    }

    getID() {
        return this._myID;
    }

    getPosition(index) {
        return this._myPositionMap.get(index);
    }

    setPosition(index, position) {
        return this._myPositionMap.set(index, position);
    }

    removeIndex(index) {
        this._myPositionMap.delete(index);
    }

    clean(indexList) {
        let variantIndexList = this._myPositionMap.keys();

        for (let variantIndex of variantIndexList) {
            if (!indexList.pp_hasEqual(variantIndex)) {
                this._myPositionMap.delete(variantIndex);
            }
        }
    }

    matchMesh(mesh) {
        let positionAttribute = mesh.attribute(MeshAttribute.Position);
        let position = [0, 0, 0];

        let match = true;

        for (let [index, vertexPosition] of this._myPositionMap.entries()) {
            positionAttribute.get(index, position);
            if (!vertexPosition.vec_equals(position, 0.00001)) {
                match = false;
                break;
            }
        }

        return match;
    }

    saveVariant(mesh, indexList) {
        let positionAttribute = mesh.attribute(MeshAttribute.Position);

        this._myPositionMap.clear();

        for (let index of indexList) {
            let vertexPosition = [0, 0, 0];
            positionAttribute.get(index, vertexPosition);
            this._myPositionMap.set(index, vertexPosition);
        }
    }

    loadVariant(mesh, isFlatShading) {
        let positionAttribute = mesh.attribute(MeshAttribute.Position);

        let vertexIndexList = [];
        for (let [index, vertexPosition] of this._myPositionMap.entries()) {
            positionAttribute.set(index, vertexPosition);

            vertexIndexList.push(index);

            VertexUtils.updateVertexNormals(index, mesh, isFlatShading);
        }
    }

    fromJSONObject(jsonObject) {
        this._myID = jsonObject._myID;
        this._myPositionMap = jsonObject._myPositionMap;

        for (let [index, position] of this._myPositionMap.entries()) {
            this._myPositionMap.set(index, [position[0], position[1], position[2]]);
        }
    }
}