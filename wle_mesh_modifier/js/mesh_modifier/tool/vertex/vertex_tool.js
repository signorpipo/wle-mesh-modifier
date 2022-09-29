VertexToolData = class VertexToolData {
    constructor(mesh) {
        this.myMeshObject = null;
        this.myIsFlatShading = true;

        this.myMeshComponent = null;
        this.myMeshAnimationObject = null;
        this.myAnimationToPlay = null;
        this.myAPoseAnimation = null;

        this.myPointerObject = null;
        this.myVertexGroupConfig = null;

        this.myIsPlayingAnimation = false;

        this.mySelectedVertexes = [];
        this.mySelectedVertexGroup = null;
        this.mySelectedVertexVariant = null;
        this.myVertexDataBackup = mesh.vertexData.pp_clone();

        this.myLeftControlScheme = null;
        this.myRightControlScheme = null;
    }
};

VertexTool = class VertexTool {
    constructor(toolData) {
        this._myToolData = toolData;

        this._myMinDistanceToSelect = 0.025;
    }

    getToolData() {
        return this._myToolData;
    }

    reset() {
        this._myToolData.mySelectedVertexes = [];
        this._myToolData.mySelectedVertexGroup = null;
        this._myToolData.mySelectedVertexVariant = null;

        if (this._myToolData.myIsPlayingAnimation) {
            let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponentHierarchy("animation");
            if (animationComponent) {
                animationComponent.stop();
                animationComponent.animation = this._myToolData.myAPoseAnimation;
                animationComponent.play();
            }
        }
    }

    start() {
        this._setupControlScheme();
    }

    end() { }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd()) {
            this._myToolData.myLeftControlScheme.setVisible(!this._myToolData.myLeftControlScheme.isVisible());
            this._myToolData.myRightControlScheme.setVisible(!this._myToolData.myRightControlScheme.isVisible());
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(2)) {
            let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponentHierarchy("animation");
            if (animationComponent) {
                animationComponent.stop();
                if (this._myToolData.myIsPlayingAnimation) {
                    animationComponent.animation = this._myToolData.myAPoseAnimation;
                } else {
                    animationComponent.animation = this._myToolData.myAnimationToPlay;
                }
                animationComponent.play();
                this._myToolData.myIsPlayingAnimation = !this._myToolData.myIsPlayingAnimation;
            }
        }
    }

    _setupControlScheme() {

    }

    // Selection
    _selectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            if (this._isSelectedVertexValid(selectedVertexParams)) {
                this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
        }
    }

    _isSelectedVertexValid(selectedVertexParams) {
        return true;
    }

    _deselectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._myToolData.mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _selectAll() {
        this._myToolData.mySelectedVertexes = [];
        let meshTransform = this._myToolData.myMeshComponent.object.pp_getTransform();

        let vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE;
        let vertexCount = this._myToolData.myMeshComponent.mesh.vertexData.length / vertexDataSize;

        for (let i = 0; i < vertexCount; i++) {
            let vertexPosition = VertexUtils.getVertexPosition(i, this._myToolData.myMeshComponent.mesh);
            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

            let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, vertexPositionWorld, this._myToolData.myVertexDataBackup);
            this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }

    _selectAllGroupVertex() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexes = [];
            let meshTransform = this._myToolData.myMeshComponent.object.pp_getTransform();
            for (let index of this._myToolData.mySelectedVertexGroup.getIndexList()) {
                let vertexPosition = VertexUtils.getVertexPosition(index, this._myToolData.myMeshComponent.mesh);
                let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

                let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, vertexPositionWorld, this._myToolData.myVertexDataBackup);
                this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
        }
    }

    // Move
    _moveSelectedVertexes(movement) {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexes(this._myToolData.myMeshObject, this._myToolData.mySelectedVertexes, movement);
        }
    }

    _moveSelectedVertexesAlongNormals(movement) {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexesAlongNormals(this._myToolData.myMeshObject, this._myToolData.mySelectedVertexes, movement, true);
        }
    }

    _updateNormals() {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            for (let selectedVertex of this._myToolData.mySelectedVertexes) {
                VertexUtils.updateVertexNormals(selectedVertex.getIndexes()[0], this._myToolData.myMeshComponent.mesh, this._myToolData.myIsFlatShading);
            }
        }
    }

    // Reset
    _resetSelectedVertexes() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {

            VertexUtils.resetVertexes(this._myToolData.myMeshComponent, selectedVertexParams.getIndexes(), this._myToolData.myVertexDataBackup, this._myToolData.myIsFlatShading);
        }
    }

    _resetGroupVertexes() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            let indexList = this._myToolData.mySelectedVertexGroup.getIndexList();
            VertexUtils.resetVertexes(this._myToolData.myMeshComponent, indexList, this._myToolData.myVertexDataBackup, this._myToolData.myIsFlatShading);

        }
    }

    _resetAllVertexes() {
        VertexUtils.resetMeshVertexData(this._myToolData.myMeshComponent, this._myToolData.myVertexDataBackup);
    }

    // Group
    _selectGroup() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

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
                this._myToolData.mySelectedVertexVariant = this._myToolData.mySelectedVertexGroup.retrieveVariant(this._myToolData.myMeshComponent.mesh);
                this._selectAllGroupVertex();
            }
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

    _deleteGroup() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.myVertexGroupConfig.removeGroup(this._myToolData.mySelectedVertexGroup.getID());
            this._myToolData.mySelectedVertexGroup = null;
            this._myToolData.mySelectedVertexVariant = null;
            this._myToolData.mySelectedVertexes = [];
        }
    }

    // Variant
    _createVariant() {
        this._myToolData.mySelectedVertexVariant = this._myToolData.mySelectedVertexGroup.saveVariant(this._myToolData.myMeshComponent.mesh, null);

        this._myVariantCreatedCallbacks.forEach(function (callback) { callback(); }.bind(this));
    }

    _editVariant() {
        if (this._myToolData.mySelectedVertexVariant == null) {
            return;

        }

        let variantID = this._myToolData.mySelectedVertexVariant.getID();
        this._myToolData.mySelectedVertexVariant = this._myToolData.mySelectedVertexGroup.saveVariant(this._myToolData.myMeshComponent.mesh, variantID);

        this._myVariantEditedCallbacks.forEach(function (callback) { callback(); }.bind(this));
    }

    _selectNextVariant(direction) {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexVariant = this._myToolData.mySelectedVertexGroup.getNextVariant(this._myToolData.mySelectedVertexVariant, direction);
            if (this._myToolData.mySelectedVertexVariant != null) {
                this._myToolData.mySelectedVertexVariant.loadVariant(this._myToolData.myMeshComponent.mesh, this._myToolData.myIsFlatShading);
            } else {
                this._resetGroupVertexes();
            }
        }
    }

    _goToEditVariant() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myEditVariantCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _goToCreateVariant() {
        if (this._myToolData.mySelectedVertexGroup != null) {
            this._myToolData.mySelectedVertexVariant = null;
            this._myEditVariantCallbacks.forEach(function (callback) { callback(); }.bind(this));
        }
    }

    _deleteVariant() {
        if (this._myToolData.mySelectedVertexGroup != null && this._myToolData.mySelectedVertexVariant != null) {
            let variantToDelete = this._myToolData.mySelectedVertexVariant;
            this._selectNextVariant(1);
            this._myToolData.mySelectedVertexGroup.removeVariant(variantToDelete.getID());
        }
    }
};