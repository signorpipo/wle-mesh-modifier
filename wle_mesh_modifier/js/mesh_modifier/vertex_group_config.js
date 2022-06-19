class VertexGroupConfig {
    constructor() {
        this._myNextGroupID = 0;
        this._myVertexGroups = new Map();
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
        this._myVertexGroups.values();
    }

    fromJSONObject(jsonObject) {
        this._myNextGroupID = jsonObject._myNextGroupID;
        this._myVertexGroups.clear();
        for (let jsonVertexGroup of jsonObject._myVertexGroups) {
            let vertexGroup = new VertexGroup(0);
            vertexGroup.fromJSONObject(jsonVertexGroup);

            this._myVertexGroups.set(vertexGroup.getID(), vertexGroup);
        }
    }
}

class VertexGroup {
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

    getVariantIDs() {
        return this._myVariants.keys();
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

    saveVariant(mesh, variantID = null) {
        if (variantID != null) {
            let variant = this._myVariants.get(variantID);
            if (variant) {
                variant.saveVariant(mesh, this._myIndexList);
            }
        } else {
            let newVariantID = this._myNextVariantID;
            this._myNextVariantID++;

            let variant = new VertexGroupVariant(newVariantID);
            variant.saveVariant(mesh, this._myIndexList);
            this._myVariants.set(newVariantID, variant);
        }
    }

    loadVariant(mesh, variantID) {
        let variant = this._myVariants.get(variantID);
        if (variant) {
            variant.loadVariant(mesh);
        }
    }

    fromJSONObject(jsonObject) {
        this._myID = jsonObject._myID;
        this._myIndexList = jsonObject._myIndexList;
        this._myNextVariantID = jsonObject._myNextVariantID;

        this._myVariants.clear();
        for (let jsonVariants of jsonObject._myVariants) {
            let variant = new VertexGroupVariant(0);
            variant.fromJSONObject(jsonVariants);

            this._myVariants.set(variant.getID(), variant);
        }
    }
}

class VertexGroupVariant {
    constructor(id) {
        this._myID = id;
        this._myPositionMap = new Map();
    }

    removeIndex(index) {
        this._myPositionMap.delete(index);
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

    loadVariant(mesh) {
        let positionAttribute = mesh.attribute(WL.MeshAttribute.Position);

        for (let [index, vertexPosition] of this._myPositionMap.entries()) {
            positionAttribute.set(index, vertexPosition);

            let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
            mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.X] = vertexPosition[0];
            mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.Y] = vertexPosition[1];
            mesh.vertexData[index * vertexDataSize + WL.Mesh.POS.Z] = vertexPosition[2];
        }
    }

    fromJSONObject(jsonObject) {
        this._myID = jsonObject._myID;
        this._myPositionMap = jsonObject._myPositionMap;
    }
}