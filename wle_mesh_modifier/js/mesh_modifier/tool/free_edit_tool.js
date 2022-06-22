FreeEditTool = class FreeEditTool extends VertexTool {
    constructor(toolData) {
        super(toolData);

        this._myPreviousPointerPosition = null;
    }

    update(dt) {
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
                }

                this._myPreviousPointerPosition = currentPointerPosition;
            }
        } else {
            this._myPreviousPointerPosition = null;
        }

        let axes = PP.myRightGamepad.getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.2) {
            let movement = axes[0] * 0.2 * dt;
            this._moveSelectedVertexesAlongNormals(movement);
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressed()) {
            this._resetSelectedVertexes();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAllVertexes();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            this._myToolData.mySelectedVertexes = [];
        }

        this._debugDraw();
    }

    _debugDraw() {
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
};