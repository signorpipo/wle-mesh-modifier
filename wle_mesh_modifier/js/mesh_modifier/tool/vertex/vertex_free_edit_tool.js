import { GamepadButtonID, getLeftGamepad } from "../../../pp";
import { VertexTool } from "./vertex_tool";

export class VertexFreeEditTool extends VertexTool {
    constructor(toolData) {
        super(toolData);

        this._myPreviousPointerPosition = null;
        this._myHasMovedVertexes = false;
        this._myHasMovedVertexesAlongNormals = false;

        this._myLastXAxisValue = 0;
    }

    update(dt) {
        super.update(dt);

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressed()) {
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

        let axes = getRightGamepad().getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.2) {
            let movement = axes[0] * 0.2 * dt;
            if (!getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                    this._changeSelectedVertexesWeight(movement / 2);
                } else {
                    this._moveSelectedVertexesAlongNormals(movement);
                }
            }

            this._myLastXAxisValue = axes[0];
            this._myHasMovedVertexesAlongNormals = true;
        } else if (this._myHasMovedVertexesAlongNormals) {
            this._myHasMovedVertexesAlongNormals = false;

            if (getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                this._increaseSelectedVertexesJointID(Math.pp_sign(this._myLastXAxisValue));
            }

            this._updateNormals();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
            this._resetSelectedVertexes();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAll();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd(2)) {
            this._selectAll();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressEnd(2)) {
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
        leftScheme.setSqueezeText("x2: Play/Stop Animation\nHold: Enable Locomotion");
        leftScheme.setThumbstickText("Left/Right: Change Tool\nUp/Down: Change Tool Group\nx2: Download Configuration");
        leftScheme.setBottomButtonText("");
        leftScheme.setTopButtonText("");

        let rightScheme = this._myToolData.myRightControlScheme;
        rightScheme.setSelectText("x1: Select Vertex\n x2: Select All Vertexes");
        rightScheme.setSqueezeText("Move Vertex Free");
        rightScheme.setThumbstickText("Left/Right: Move Vertex Along Normal\nx1: Toggle Control Scheme");
        rightScheme.setBottomButtonText("x1: Reset Vertex\n x2: Reset All Vertexes");
        rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
    }

    _debugDraw() {
        //if (this._myToolData.myIsPlayingAnimation) return;

        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw();
        }

        if (this._myToolData.mySelectedVertexes.length > 0) {
            //this._myToolData.mySelectedVertexes[0].debugInfo();
        }
    }
}