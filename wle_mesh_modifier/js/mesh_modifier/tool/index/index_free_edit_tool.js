import { MeshIndexType, Mesh } from "@wonderlandengine/api";
import { GamepadButtonID, getLeftGamepad, getRightGamepad } from "../../../pp";

IndexFreeEditTool = class IndexFreeEditTool extends IndexTool {
    constructor(toolData) {
        super(toolData);
    }

    update(dt) {
        super.update(dt);

        if (getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAllIndexes();
            //this._myToolData.myMeshObject.pp_setActive(false);
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

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd(2)) {
            this._deleteSelectedVertexesFromIndexData();
            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd(3)) {
            this._hideSelectedVertexesFromIndexData();
            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (getLeftGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
            let newIndexData = VertexUtils.getIndexDataAfterDeleteSelectedVertexes(this._myToolData.myMeshComponent, this._myToolData.mySelectedVertexes);
            let newMesh = new Mesh({
                indexData: newIndexData,
                indexType: MeshIndexType.UnsignedInt,
                vertexData: this._myToolData.myMeshComponent.mesh.vertexData
            });
            this._myToolData.myMeshComponent.mesh = newMesh;

            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (getLeftGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressEnd(2)) {
            let newMesh = new Mesh({
                indexData: this._myToolData.myMeshComponent.mesh.indexData,
                indexType: MeshIndexType.UnsignedInt,
                vertexData: this._myToolData.myMeshComponent.mesh.vertexData
            });

            this._myToolData.myMeshComponent.mesh = newMesh;

            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        this._debugDraw();
    }

    _deselectAll() {
        this._myToolData.mySelectedVertexes = [];
    }

    _setupControlScheme() {
        let leftScheme = this._myToolData.myLeftControlScheme;
        leftScheme.setSelectText("");
        leftScheme.setSqueezeText("x2: Play/Stop Animation\nHold: Enable Locomotion");
        leftScheme.setThumbstickText("Left/Right: Change Tool\nUp/Down: Change Tool Group");
        leftScheme.setBottomButtonText("x2: Delete Vertexes' Indexes With New Mesh");
        leftScheme.setTopButtonText("x2: Replace With New Equal Mesh");

        let rightScheme = this._myToolData.myRightControlScheme;
        rightScheme.setSelectText("x1: Select Vertex\n x2: Select All Vertexes");
        rightScheme.setSqueezeText("x2: Delete Vertexes' Indexes\nx3: Hide Vertexes' Indexes");
        rightScheme.setThumbstickText("x1: Toggle Control Scheme");
        rightScheme.setBottomButtonText("x2: Reset All Indexes");
        rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
    }

    _debugDraw() {
        if (this._myToolData.myIsPlayingAnimation) return;

        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw();
        }
    }
};