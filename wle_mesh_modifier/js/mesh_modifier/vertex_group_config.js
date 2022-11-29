MeshVariantSetup = class MeshVariantSetup {
    constructor() {
        this._myVariantSetupMap = new Map();
    }

    setGroupVariant(groupID, variantID) {
        this._myVariantSetupMap.set(groupID, variantID);
    }

    getVariantSetupMap() {
        return this._myVariantSetupMap;
    }
};

VertexGroupConfig = class VertexGroupConfig {
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

    remapToMesh(fromMesh, toMesh) {
        let resultGroupConfig = new VertexGroupConfig();

        for (let [groupID, group] of this._myVertexGroups.entries()) {
            let resultGroup = group.remapToMesh(fromMesh, toMesh);
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
};

VertexGroup = class VertexGroup {
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

    remapToMesh(fromMesh, toMesh) {
        let resultGroup = new VertexGroup(this._myID);
        let identityTransform = PP.mat4_create().mat4_identity();

        for (let [variantID, variant] of this._myVariants.entries()) {
            resultGroup._myVariants.set(variantID, new VertexGroupVariant(variantID));
        }
        resultGroup._myNextVariantID = this._myNextVariantID;

        for (let index of this._myIndexList) {
            let fromVertexPosition = VertexUtils.getVertexPosition(index, fromMesh);
            let toVertexIndex = VertexUtils.getClosestVertexIndex(toMesh, identityTransform, fromVertexPosition);
            let toVertexIndexList = VertexUtils.getSameVertexIndexes(toMesh, toVertexIndex);

            let resultIndexListLengthBeforeAdd = resultGroup._myIndexList.length;
            for (let toIndex of toVertexIndexList) {
                resultGroup.addIndex(toIndex);
            }

            let newIndexAdded = resultIndexListLengthBeforeAdd != resultGroup._myIndexList.length;
            if (newIndexAdded) {
                for (let [variantID, variant] of this._myVariants.entries()) {
                    let resultVariant = resultGroup._myVariants.get(variantID);

                    let fromVertexPosition = variant.getPosition(index);
                    for (let toIndex of toVertexIndexList) {
                        resultVariant.setPosition(toIndex, fromVertexPosition);
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

            PP.myDebugVisualManager.drawPoint(0, vertexPositionWorld, color, 0.002);
        }
    }
};

VertexGroupVariant = class VertexGroupVariant {
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
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);
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
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        this._myPositionMap.clear();

        for (let index of indexList) {
            let vertexPosition = [0, 0, 0];
            positionAttribute.get(index, vertexPosition);
            this._myPositionMap.set(index, vertexPosition);
        }
    }

    loadVariant(mesh, isFlatShading) {
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

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
    }
};