IndexFreeEditTool = class IndexFreeEditTool extends IndexTool {
    constructor(toolData) {
        super(toolData);
    }

    update(dt) {
        super.update(dt);

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._resetAllIndexes();
            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(2)) {
            this._selectAll();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            this._deselectAll();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(2)) {
            this._deleteSelectedVertexesFromIndexData();
            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(3)) {
            this._hideSelectedVertexesFromIndexData();
            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            let newIndexData = VertexUtils.getIndexDataAfterDeleteSelectedVertexes(this._myToolData.myMeshComponent, this._myToolData.mySelectedVertexes);
            let newMesh = new WL.Mesh({
                indexData: newIndexData,
                indexType: WL.MeshIndexType.UnsignedInt,
                vertexData: this._myToolData.myMeshComponent.mesh.vertexData
            });
            this._myToolData.myMeshComponent.mesh = newMesh;

            //this._myToolData.myMeshObject.pp_setActive(false);
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            let newMesh = new WL.Mesh({
                indexData: this._myToolData.myMeshComponent.mesh.indexData,
                indexType: WL.MeshIndexType.UnsignedInt,
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