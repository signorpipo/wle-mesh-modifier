IndexFreeEditTool = class IndexFreeEditTool extends IndexTool {
    constructor(toolData) {
        super(toolData);
    }

    update(dt) {
        super.update(dt);

        this._debugDraw();
    }

    _setupControlScheme() {
        let leftScheme = this._myToolData.myLeftControlScheme;
        leftScheme.setSelectText("");
        leftScheme.setSqueezeText("x2: Play/Stop Animation\nHold: Enable Locomotion");
        leftScheme.setThumbstickText("Left/Right: Change Tool\nUp/Down: Change Tool Group");
        leftScheme.setBottomButtonText("");
        leftScheme.setTopButtonText("");

        let rightScheme = this._myToolData.myRightControlScheme;
        rightScheme.setSelectText("x1: Select Vertex\n x2: Select All Vertexes");
        rightScheme.setSqueezeText("Delete Vertexes' Indexes");
        rightScheme.setThumbstickText("x1: Toggle Control Scheme");
        rightScheme.setBottomButtonText("x2: Reset All Indexes");
        rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
    }

    _debugDraw() {

    }
};