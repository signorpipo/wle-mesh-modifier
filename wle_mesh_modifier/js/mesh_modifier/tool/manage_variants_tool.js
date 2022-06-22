ManageVariantsTool = class ManageVariantsTool {
    constructor(tooldata) {
        this._myToolData = tooldata;

        this._myMinDistanceToSelect = 0.025;

        this._myEditVariantCallbacks = new Map();

        this._myNextActive = true;
    }

    start() {
        this._myToolData.myMeshComponent.active = true;
    }

    end() {
    }

    update(dt) {
        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.5) {
            if (this._myNextActive) {
                this._selectNextVariant(Math.pp_sign(axes[0]));

                this._myNextActive = false;
            } else {
                this._myToolData.myMeshComponent.active = true;
            }
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._myToolData.mySelectedVertexGroup != null) {
                this._myToolData.mySelectedVertexGroup = null;
                this._myToolData.mySelectedVertexVariant = null;
            } else {
                this._selectGroup();
            }
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(1)) {
            this._resetGroupVertexes();
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAllVertexes();
        } else if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            this._editVariant();
        } else if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._createVariant();
        } else if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(2)) {
            this._deleteVariant();
        } else {
            this._myToolData.myMeshComponent.active = true;
            this._myNextActive = true;
        }

        this._debugDraw();
    }

    _selectNextVariant(direction) {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexVariant = this._myToolData.mySelectedVertexGroup.getNextVariant(this._myToolData.mySelectedVertexVariant, direction);
            if (this._myToolData.mySelectedVertexVariant != null) {
                this._myToolData.mySelectedVertexVariant.loadVariant(this._myToolData.myMeshComponent.mesh);
                this._myToolData.myMeshComponent.active = false;
            } else {
                this._resetGroupVertexes();
            }
        }
    }

    _editVariant() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myEditVariantCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _createVariant() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexVariant = null;
            this._myEditVariantCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _deleteVariant() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.myVertexGroupConfig.removeGroup(this._myToolData.mySelectedVertexGroup.getID());
            this._myToolData.mySelectedVertexGroup = null;
        }
    }

    _resetGroupVertexes() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            let indexList = this._myToolData.mySelectedVertexGroup.getIndexList();
            VertexUtils.resetVertexes(this._myToolData.myMeshComponent, indexList, this._myToolData.myVertexDataBackup);
            this._myToolData.myMeshComponent.active = false;

        }
    }

    _resetAllVertexes() {
        VertexUtils.resetMesh(this._myToolData.myMeshComponent, this._myToolData.myVertexDataBackup);
        this._myToolData.myMeshComponent.active = false;
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
                this._myToolData.mySelectedVertexVariant = null;
            }
        }
    }

    _debugDraw() {
        if (this._myToolData.mySelectedVertexGroup == null) {
            this._myToolData.myVertexGroupConfig.debugDraw(this._myToolData.myMeshComponent);
        } else {
            this._myToolData.mySelectedVertexGroup.debugDraw(this._myToolData.myMeshComponent);
        }
    }

    registerEditVariantEventListener(id, callback) {
        this._myEditVariantCallbacks.set(id, callback);
    }

    unregisterEditVariantEventListener(id) {
        this._myEditVariantCallbacks.delete(id);
    }
};