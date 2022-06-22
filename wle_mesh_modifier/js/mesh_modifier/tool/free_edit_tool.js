FreeEditTool = class FreeEditTool {
    constructor(tooldata) {
        this._myToolData = tooldata;

        this._myPreviousPointerPosition = null;

        this._myMinDistanceToSelect = 0.025;
    }

    start() {
        this._myToolData.myMeshComponent.active = true;
    }

    end() {
    }

    update(dt) {
        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
            if (this._myPreviousPointerPosition == null) {
                this._myPreviousPointerPosition = this._myToolData.myPointerObject.pp_getPosition();
            } else {
                let currentPointerPosition = this._myToolData.myPointerObject.pp_getPosition();

                let difference = currentPointerPosition.vec3_sub(this._myPreviousPointerPosition);
                let movement = difference.vec3_length();
                if (movement > 0.00025) {
                    difference.vec3_normalize(difference);
                    difference.vec3_scale(movement, difference);
                    this._moveSelectedVertexes(difference);
                } else {
                    this._myToolData.myMeshComponent.active = true;
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

            this._myPreviousPointerPosition = null;
            VertexUtils.resetMesh(this._myToolData.myMeshComponent, this._myToolData.myVertexDataBackup);
            this._myToolData.myMeshComponent.active = false;

        } else {
            this._myPreviousPointerPosition = null;
            this._myToolData.myMeshComponent.active = true;

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
                this._selectVertex();
            }

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
                this._deselectVertex();
            }

            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
                this._myToolData.mySelectedVertexes = [];
            }
        }

        this._debugDraw();
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

    _resetSelectedVertexes() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {

            VertexUtils.resetVertexes(this._myToolData.myMeshComponent, selectedVertexParams.getIndexes(), this._myToolData.myVertexDataBackup);

            this._myToolData.myMeshComponent.active = false;
        } else {
            this._myToolData.myMeshComponent.active = true;
        }
    }

    _moveSelectedVertexes(movement) {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexes(this._myToolData.myMeshObject, this._myToolData.mySelectedVertexes, movement);
            this._myToolData.myMeshComponent.active = !this._myToolData.myMeshComponent.active;
        }
    }

    _moveSelectedVertexesAlongNormals(movement) {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.moveSelectedVertexesAlongNormals(this._myToolData.myMeshObject, this._myToolData.mySelectedVertexes, movement);
            this._myToolData.myMeshComponent.active = !this._myToolData.myMeshComponent.active;
        }
    }

    _debugDraw() {
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
};