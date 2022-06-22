ManageVariantsTool = class ManageVariantsTool {
    constructor(meshObject, pointer, vertexGroupConfig) {
        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;
        this._myVertexGroupConfig = vertexGroupConfig;

        this._myMeshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");

        this._myVertexDataBackup = [];
        for (let vertex of this._myMeshComponent.mesh.vertexData) {
            this._myVertexDataBackup.push(vertex);
        }

        this._myMinDistanceToSelect = 0.025;

        this._mySelectedVertexGroup = null;
        this._mySelectedVertexVariant = null;

        this._myEditVariantCallbacks = new Map();

        this._myNextActive = true;
    }

    start() {
        this._mySelectedVertexGroup = null;
        this._myMeshComponent.active = true;
    }

    end() {
        this._mySelectedVertexGroup = null;
        this._myMeshComponent.active = true;
    }

    update(dt) {
        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.5) {
            if (this._myNextActive) {
                this._selectNextVariant(Math.pp_sign(axes[0]));

                this._myNextActive = false;
            } else {
                this._myMeshComponent.active = true;
            }
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            if (this._mySelectedVertexGroup != null) {
                this._mySelectedVertexGroup = null;
                this._mySelectedVertexVariant = null;
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
            this._myMeshComponent.active = true;
            this._myNextActive = true;
        }

        this._debugDraw();
    }

    _selectNextVariant(direction) {
        if (this._mySelectedVertexGroup != null) {
            this._mySelectedVertexVariant = this._mySelectedVertexGroup.getNextVariant(this._mySelectedVertexVariant, direction);
            if (this._mySelectedVertexVariant != null) {
                this._mySelectedVertexVariant.loadVariant(this._myMeshComponent.mesh);
                this._myMeshComponent.active = false;
            } else {
                this._resetGroupVertexes();
            }
        }
    }

    _editVariant() {
        if (this._mySelectedVertexGroup != null) {
            this._myEditVariantCallbacks.forEach(function (callback) { callback(this._mySelectedVertexGroup, this._mySelectedVertexVariant); }.bind(this));
        }
    }

    _createVariant() {
        if (this._mySelectedVertexGroup != null) {
            this._myEditVariantCallbacks.forEach(function (callback) { callback(this._mySelectedVertexGroup, null); }.bind(this));
        }
    }

    _deleteVariant() {
        if (this._mySelectedVertexGroup != null) {
            this._myVertexGroupConfig.removeGroup(this._mySelectedVertexGroup.getID());
            this._mySelectedVertexGroup = null;
        }
    }

    _resetGroupVertexes() {
        if (this._mySelectedVertexGroup != null) {
            let indexList = this._mySelectedVertexGroup.getIndexList();
            VertexUtils.resetVertexes(this._myMeshComponent, indexList, this._myVertexDataBackup);
            this._myMeshComponent.active = false;

        }
    }

    _resetAllVertexes() {
        VertexUtils.resetMesh(this._myMeshComponent, this._myVertexDataBackup);
        this._myMeshComponent.active = false;
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
                this._mySelectedVertexVariant = null;
            }
        }
    }

    _debugDraw() {
        if (this._mySelectedVertexGroup == null) {
            this._myVertexGroupConfig.debugDraw(this._myMeshComponent);
        } else {
            this._mySelectedVertexGroup.debugDraw(this._myMeshComponent);
        }
    }

    registerEditVariantEventListener(id, callback) {
        this._myEditVariantCallbacks.set(id, callback);
    }

    unregisterEditVariantEventListener(id) {
        this._myEditVariantCallbacks.delete(id);
    }
};