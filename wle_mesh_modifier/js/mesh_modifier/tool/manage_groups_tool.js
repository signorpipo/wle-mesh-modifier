ManageGroupsTool = class ManageGroupsTool {
    constructor(meshObject, pointer, vertexGroupConfig) {
        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;
        this._myVertexGroupConfig = vertexGroupConfig;

        this._myMeshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");

        this._myVertexDataBackup = [];
        for (let vertex of this._myMeshComponent.mesh.vertexData) {
            this._myVertexDataBackup.push(vertex);
        }

        this._mySelectedVertexes = [];

        this._myMinDistanceToSelect = 0.025;

        this._mySelectedVertexGroup = null;

        this._myGroupSavedCallbacks = new Map();
    }

    start() {
        this._mySelectedVertexes = [];
    }

    end() {
        this._mySelectedVertexes = [];
    }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            this._mySelectedVertexes = [];
            if (this._mySelectedVertexGroup != null) {
                this._mySelectedVertexGroup = null;
            } else {
                this._selectGroup();
            }
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            if (this._mySelectedVertexes.length > 0) {
                this._mySelectedVertexes = [];
            } else {
                this._selectAllGroupVertex();
            }
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._saveGroup();
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(2)) {
            this._deleteGroup();
        }

        this._debugDraw();
    }

    _deleteGroup() {
        if (this._mySelectedVertexGroup != null) {
            this._myVertexGroupConfig.removeGroup(this._mySelectedVertexGroup.getID());
            this._mySelectedVertexGroup = null;
            this._mySelectedVertexes = [];
        }
    }

    _selectAllGroupVertex() {
        if (this._mySelectedVertexGroup != null) {
            this._mySelectedVertexes = [];
            let meshTransform = this._myMeshComponent.object.pp_getTransform();
            for (let index of this._mySelectedVertexGroup.getIndexList()) {
                let vertexPosition = VertexUtils.getVertexPosition(index, this._myMeshComponent.mesh);
                let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

                let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, vertexPositionWorld);
                this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
        }
    }

    _selectGroup() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect * 2) {
            let vertexIndex = selectedVertexParams.getIndexes()[0];
            let selectedGroup = null;
            for (let group of this._myVertexGroupConfig.getGroups()) {
                let groupIndexList = group.getIndexList();
                if (groupIndexList.pp_hasEqual(vertexIndex)) {
                    selectedGroup = group;
                    break;
                }
            }

            if (selectedGroup) {
                this._mySelectedVertexGroup = selectedGroup;
                this._selectAllGroupVertex();
            }
        }
    }

    _selectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }

    _deselectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _saveGroup() {
        let indexList = [];
        for (let selectedVertex of this._mySelectedVertexes) {
            let selectedIndexList = selectedVertex.getIndexes();
            indexList.push(...selectedIndexList);
        }

        if (indexList.length > 0) {
            if (this._mySelectedVertexGroup == null) {
                this._mySelectedVertexGroup = this._myVertexGroupConfig.addGroup();
            }

            this._mySelectedVertexGroup.setIndexList(indexList);

            this._myGroupSavedCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _debugDraw() {
        if (this._mySelectedVertexGroup == null) {
            this._myVertexGroupConfig.debugDraw(this._myMeshComponent);
        } else {
            this._mySelectedVertexGroup.debugDraw(this._myMeshComponent);
        }

        let color = null;
        if (this._mySelectedVertexGroup != null) {
            color = randomColor(this._mySelectedVertexGroup.getID());
        }
        for (let selectedVertex of this._mySelectedVertexes) {
            selectedVertex.debugDraw(color);
        }
    }

    registerGroupSavedEventListener(id, callback) {
        this._myGroupSavedCallbacks.set(id, callback);
    }

    unregisterGroupSavedEventListener(id) {
        this._myGroupSavedCallbacks.delete(id);
    }
};