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
        this._myPreviousPointerPosition = null;

        this._myMinDistanceToSelect = 0.025;
    }

    start() {
        this._mySelectedVertexes = [];
    }

    end() {
        this._mySelectedVertexes = [];
    }

    update(dt) {
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

        } else if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd()) {

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
        }

        this._debugDraw();
    }

    _selectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, this._myPointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }

    _deselectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, this._myPointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _resetSelectedVertexes() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, this._myPointerObject);

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
        this._myVertexGroupConfig.debugDraw();

        for (let selectedVertex of this._mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
};