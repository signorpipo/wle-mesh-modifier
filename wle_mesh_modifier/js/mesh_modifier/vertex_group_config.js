VertexGroupConfig = class VertexGroupConfig {
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
        for (let jsonVariants of jsonObject._myVariants.values()) {
            let variant = new VertexGroupVariant(0);
            variant.fromJSONObject(jsonVariants);

            this._myVariants.set(variant.getID(), variant);
        }
    }

    debugDraw(meshComponent) {
        let meshTransform = meshComponent.object.pp_getTransform();
        let mesh = meshComponent.mesh;
        let meshVertexes = mesh.vertexData;

        let color = randomColor(this._myID);

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        for (let vertexIndex of this._myIndexList) {
            let vertexPosition = [
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.X],
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.Y],
                meshVertexes[vertexIndex * vertexDataSize + WL.Mesh.POS.Z]];


            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);
            {
                let debugDrawParams = new PP.DebugPointParams();
                debugDrawParams.myPosition = vertexPositionWorld;
                debugDrawParams.myRadius = 0.003;
                debugDrawParams.myColor = color;
                PP.myDebugManager.draw(debugDrawParams);
            }
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
};