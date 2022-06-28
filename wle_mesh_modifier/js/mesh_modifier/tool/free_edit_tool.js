FreeEditTool = class FreeEditTool extends VertexTool {
    constructor(toolData) {
        super(toolData);

        this._myPreviousPointerPosition = null;
        this._myHasMovedVertexes = false;
        this._myHasMovedVertexesAlongNormals = false;
    }

    update(dt) {
        super.update(dt);

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
            if (this._myPreviousPointerPosition == null) {
                this._myPreviousPointerPosition = this._myToolData.myPointerObject.pp_getPosition();
            } else {
                let currentPointerPosition = this._myToolData.myPointerObject.pp_getPosition();

                let movement = currentPointerPosition.vec3_sub(this._myPreviousPointerPosition);
                let movementIntensity = movement.vec3_length();
                if (movementIntensity > 0.00025) {
                    movement.vec3_normalize(movement);
                    movement.vec3_scale(movementIntensity, movement);
                    this._moveSelectedVertexes(movement);
                    this._myHasMovedVertexes = true;
                }

                this._myPreviousPointerPosition = currentPointerPosition;
            }
        } else {
            this._myPreviousPointerPosition = null;
            if (this._myHasMovedVertexes) {
                this._myHasMovedVertexes = false;
                this._updateNormals();
            }
        }

        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.2) {
            let movement = axes[0] * 0.2 * dt;
            this._moveSelectedVertexesAlongNormals(movement);
            this._myHasMovedVertexesAlongNormals = true;
        } else if (this._myHasMovedVertexesAlongNormals) {
            this._myHasMovedVertexesAlongNormals = false;
            this._updateNormals();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressed()) {
            this._resetSelectedVertexes();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAll();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            this._deselectAll();
        }

        this._debugDraw();
    }

    _deselectAll() {
        this._myToolData.mySelectedVertexes = [];
    }

    _resetAll() {
        this._resetAllVertexes();
    }

    _setupControlScheme() {
        let leftScheme = this._myToolData.myLeftControlScheme;
        leftScheme.setSelectText("");
        leftScheme.setSqueezeText("Hold: Enable Locomotion");
        leftScheme.setThumbstickText("x2: Download Configuration\nLeft/Right: Change Tool");
        leftScheme.setBottomButtonText("");
        leftScheme.setTopButtonText("");

        let rightScheme = this._myToolData.myRightControlScheme;
        rightScheme.setSelectText("Select Vertex");
        rightScheme.setSqueezeText("Move Vertex Free");
        rightScheme.setThumbstickText("x1: Toggle Control Scheme\nLeft/Right: Move Vertex Along Normal");
        rightScheme.setBottomButtonText("x1: Reset Vertex\n x2: Reset All Vertexes");
        rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
    }

    _debugDraw() {
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
};