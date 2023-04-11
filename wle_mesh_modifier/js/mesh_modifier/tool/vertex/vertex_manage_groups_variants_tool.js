import { GamepadButtonID, getLeftGamepad, getRightGamepad } from "../../../pp";
import { randomColor } from "../../cauldron_utils";
import { VertexTool } from "./vertex_tool";

export class VertexManageGroupsVariantsTool extends VertexTool {
    constructor(toolData, manageGroups = false, manageVariants = false) {
        super(toolData);

        this._myManageGroups = manageGroups;
        this._myManageVariants = manageVariants;

        this._myScrollEnabled = true;

        this._myGroupSavedCallbacks = new Map();
        this._myEditVariantCallbacks = new Map();
    }

    start() {
        super.start();

        if (this._myToolData.mySelectedVertexGroup != null) {
            this._selectAllGroupVertex();
        }
    }

    update(dt) {
        super.update(dt);

        let axes = getRightGamepad().getAxesInfo().getAxes();
        if (Math.abs(axes[0]) > 0.5 && !getLeftGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressed()) {
            if (this._myScrollEnabled) {
                this._selectNextVariant(Math.pp_sign(axes[0]));

                this._myScrollEnabled = false;
            }
        } else {
            this._myScrollEnabled = true;
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd()) {
            this._myToolData.mySelectedVertexes = [];
            if (this._myToolData.mySelectedVertexGroup != null) {
                this._myToolData.mySelectedVertexGroup = null;
                this._myToolData.mySelectedVertexVariant = null;
            } else {
                this._selectGroup();
            }
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetGroupVertexes();
            this._myToolData.mySelectedVertexVariant = null;
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(3)) {
            this._resetAllVertexes();
            this._myToolData.mySelectedVertexVariant = null;
        }


        if (this._myManageGroups) {
            if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                this._selectVertex();
            }

            if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd(2)) {
                this._selectAllGroupVertex();
            }

            if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd(3)) {
                this._selectAll();
            }

            if (getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) {
                this._deselectVertex();
            }

            if (getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressEnd(2)) {
                this._myToolData.mySelectedVertexes = [];
            }

            if (getLeftGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._saveGroup();
            }

            if (getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd(2)) {
                this._deleteGroup();
            }
        }

        if (this._myManageVariants) {
            if (getLeftGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressEnd(2)) {
                this._goToEditVariant();
            }

            if (getLeftGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._goToCreateVariant();
            }

            if (getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd(2)) {
                this._deleteVariant();
            }
        }

        this._debugDraw();
    }

    _setupControlScheme() {
        let leftScheme = this._myToolData.myLeftControlScheme;
        let rightScheme = this._myToolData.myRightControlScheme;

        leftScheme.setSqueezeText("x2: Play/Stop Animation\nHold: Enable Locomotion");
        leftScheme.setThumbstickText("Left/Right: Change Tool\nUp/Down: Change Tool Group\nx2: Download Configuration");

        rightScheme.setSqueezeText("Select/Deselect Group");
        rightScheme.setThumbstickText("Left/Right: Change Current Group Variant\nx1: Toggle Control Scheme");

        if (this._myManageVariants) {
            leftScheme.setSelectText("x2: Delete Variant");
            leftScheme.setBottomButtonText("x2 Create Variant");
            leftScheme.setTopButtonText("x2 Edit Variant");

            rightScheme.setSelectText("");
            rightScheme.setTopButtonText("");
            rightScheme.setBottomButtonText("x2: Reset All Group Vertexes\n x3: Reset All Vertexes");
        }

        if (this._myManageGroups) {
            leftScheme.setSelectText("x2: Delete Group");
            leftScheme.setBottomButtonText("x2 Save Group");
            leftScheme.setTopButtonText("");

            rightScheme.setSelectText("x1: Select Vertex\n x2: Select All Group Vertexes\n x3: Select All Vertexes");
            rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
            rightScheme.setBottomButtonText("x1: Reset Vertex\n x2: Reset All Group Vertexes\n x3: Reset All Vertexes");
        }
    }

    _debugDraw() {
        if (this._myToolData.myIsPlayingAnimation) return;

        if (this._myToolData.mySelectedVertexGroup == null) {
            this._myToolData.myVertexGroupConfig.debugDraw(this._myToolData.myMeshComponent);
        } else {
            this._myToolData.mySelectedVertexGroup.debugDraw(this._myToolData.myMeshComponent);
        }

        if (this._myManageGroups) {
            let color = null;
            if (this._myToolData.mySelectedVertexGroup != null) {
                color = randomColor(this._myToolData.mySelectedVertexGroup.getID());
            }
            for (let selectedVertex of this._myToolData.mySelectedVertexes) {
                selectedVertex.debugDraw(color);
            }
        }
    }

    registerGroupSavedEventListener(id, callback) {
        this._myGroupSavedCallbacks.set(id, callback);
    }

    unregisterGroupSavedEventListener(id) {
        this._myGroupSavedCallbacks.delete(id);
    }

    registerEditVariantEventListener(id, callback) {
        this._myEditVariantCallbacks.set(id, callback);
    }

    unregisterEditVariantEventListener(id) {
        this._myEditVariantCallbacks.delete(id);
    }
}