ManageGroupsTool = class ManageGroupsTool {
    constructor(tooldata) {
        this._myToolData = tooldata;

        this._myMinDistanceToSelect = 0.025;

        this._myGroupSavedCallbacks = new Map();
    }

    start() {
        this._myToolData.myMeshComponent.active = true;

        if (this._myToolData.mySelectedVertexGroup != null) {
            this._selectAllGroupVertex();
        }
    }

    end() {
    }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            if (this._myToolData.mySelectedVertexes.length > 0) {
                this._myToolData.mySelectedVertexes = [];
            } else {
                this._selectAllGroupVertex();
            }
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            this._myToolData.mySelectedVertexes = [];
            if (this._myToolData.mySelectedVertexGroup != null) {
                this._myToolData.mySelectedVertexGroup = null;
            } else {
                this._selectGroup();
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
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.myVertexGroupConfig.removeGroup(this._myToolData.mySelectedVertexGroup.getID());
            this._myToolData.mySelectedVertexGroup = null;
            this._myToolData.mySelectedVertexes = [];
        }
    }

    _selectAllGroupVertex() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexes = [];
            let meshTransform = this._myToolData.myMeshComponent.object.pp_getTransform();
            for (let index of this._myToolData.mySelectedVertexGroup.getIndexList()) {
                let vertexPosition = VertexUtils.getVertexPosition(index, this._myToolData.myMeshComponent.mesh);
                let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

                let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, vertexPositionWorld);
                this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
        }
    }

    _selectGroup() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect * 2) {
            let vertexIndex = selectedVertexParams.getIndexes()[0];
            let selectedGroup = null;
            for (let group of this._myToolData.myVertexGroupConfig.getGroups()) {
                let groupIndexList = group.getIndexList();
                if (groupIndexList.pp_hasEqual(vertexIndex)) {
                    selectedGroup = group;
                    break;
                }
            }

            if (selectedGroup) {
                this._myToolData.mySelectedVertexGroup = selectedGroup;
                this._selectAllGroupVertex();
            }
        }
    }

    _selectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }

    _deselectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._myToolData.mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _saveGroup() {
        let indexList = [];
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            let selectedIndexList = selectedVertex.getIndexes();
            indexList.push(...selectedIndexList);
        }

        if (indexList.length > 0) {
            if (this._myToolData.mySelectedVertexGroup == null) {
                this._myToolData.mySelectedVertexGroup = this._myToolData.myVertexGroupConfig.addGroup();
            }

            this._myToolData.mySelectedVertexGroup.setIndexList(indexList);

            this._myGroupSavedCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _debugDraw() {
        if (this._myToolData.mySelectedVertexGroup == null) {
            this._myToolData.myVertexGroupConfig.debugDraw(this._myToolData.myMeshComponent);
        } else {
            this._myToolData.mySelectedVertexGroup.debugDraw(this._myToolData.myMeshComponent);
        }

        let color = null;
        if (this._myToolData.mySelectedVertexGroup != null) {
            color = randomColor(this._myToolData.mySelectedVertexGroup.getID());
        }
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
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