EditVariantTool = class EditVariantTool {
    constructor(meshObject, pointer) {
        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;

        this._myMeshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");

        this._myVertexDataBackup = [];
        for (let vertex of this._myMeshComponent.mesh.vertexData) {
            this._myVertexDataBackup.push(vertex);
        }

        this._mySelectedVertexes = [];
        this._myPreviousPointerPosition = null;

        this._myMinDistanceToSelect = 0.025;

        this._mySelectedVertexGroup = null;
        this._mySelectedVertexVariant = null;

        this._myVariantSavedCallbacks = new Map();
    }

    start(group, variant) {
        this._mySelectedVertexGroup = null;
        this._mySelectedVertexVariant = null;
        this._mySelectedVertexes = [];
        this._myMeshComponent.active = true;

        if (group != null) {
            this._mySelectedVertexGroup = group;
            if (variant != null && group.getVariantIDs().pp_hasEqual(variant.getID())) {
                this._mySelectedVertexVariant = variant;
            }
        }
    }

    end() {
        this._mySelectedVertexGroup = null;
        this._mySelectedVertexVariant = null;
        this._mySelectedVertexes = [];
        this._myMeshComponent.active = true;
    }

    update(dt) {
        if (this._mySelectedVertexGroup == null) {
            return;
        }

        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
            if (this._myPreviousPointerPosition == null) {
                this._myPreviousPointerPosition = this._myPointerObject.pp_getPosition();
            } else {
                let currentPointerPosition = this._myPointerObject.pp_getPosition();

                let difference = currentPointerPosition.vec3_sub(this._myPreviousPointerPosition);
                let movement = difference.vec3_length();
                if (movement > 0.00025) {
                    difference.vec3_normalize(difference);
                    difference.vec3_scale(movement, difference);
                    this._moveSelectedVertexes(difference);
                } else {
                    this._myMeshComponent.active = true;
                }

                this._myPreviousPointerPosition = currentPointerPosition;
            }
        } else if (Math.abs(axes[0]) > 0.2) {

            this._myPreviousPointerPosition = null;
            let movement = axes[0] * 0.2 * dt;
            this._moveSelectedVertexesAlongNormals(movement);

        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressed()) {

            this._myPreviousPointerPosition = null;
            this._resetSelectedVertexes();

        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetGroupVertexes();
        } else if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(3)) {

            this._myPreviousPointerPosition = null;
            VertexUtils.resetMesh(this._myMeshComponent, this._myVertexDataBackup);
            this._myMeshComponent.active = false;

        } else {
            this._myPreviousPointerPosition = null;
            this._myMeshComponent.active = true;

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
                this._selectVertex();
            }

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
                this._deselectVertex();
            }

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
                this._mySelectedVertexes = [];
            }

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
                this._saveVariant();
            }
        }

        this._debugDraw();
    }

    _saveVariant() {
        let variantID = null;
        if (this._mySelectedVertexVariant != null) {
            variantID = this._mySelectedVertexVariant.getID();
        }

        this._mySelectedVertexVariant = this._mySelectedVertexGroup.saveVariant(this._myMeshComponent.mesh, variantID);

        this._myVariantSavedCallbacks.forEach(function (callback) { callback(); }.bind(this));
    }

    _selectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            let selectedIndex = selectedVertexParams.getIndexes()[0];
            if (this._mySelectedVertexGroup.getIndexList().pp_hasEqual(selectedIndex)) {
                this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
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

    _resetGroupVertexes() {
        if (this._mySelectedVertexGroup != null) {
            let indexList = this._mySelectedVertexGroup.getIndexList();
            VertexUtils.resetVertexes(this._myMeshComponent, indexList, this._myVertexDataBackup);
            this._myMeshComponent.active = false;

        }
    }

    _resetSelectedVertexes() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {

            VertexUtils.resetVertexes(this._myMeshComponent, selectedVertexParams.getIndexes(), this._myVertexDataBackup);

            this._myMeshComponent.active = false;
        } else {
            this._myMeshComponent.active = true;
        }
    }

    _moveSelectedVertexes(movement) {
        if (this._mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexes(this._myMeshObject, this._mySelectedVertexes, movement);
            this._myMeshComponent.active = !this._myMeshComponent.active;
        }
    }

    _moveSelectedVertexesAlongNormals(movement) {
        if (this._mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexesAlongNormals(this._myMeshObject, this._mySelectedVertexes, movement);
            this._myMeshComponent.active = !this._myMeshComponent.active;
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

    registerVariantSavedEventListener(id, callback) {
        this._myVariantSavedCallbacks.set(id, callback);
    }

    unregisterVariantSavedEventListener(id) {
        this._myVariantSavedCallbacks.delete(id);
    }
};