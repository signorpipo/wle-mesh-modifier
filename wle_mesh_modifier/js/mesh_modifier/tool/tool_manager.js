ToolManager = class ToolManager {
    constructor(meshObject, pointer, toolLabel) {
        this._myActiveToolIndex = 0;

        this._myToolOrder = [
            ToolType.FREE_EDIT,
            ToolType.GROUP_MANAGEMENT,
            ToolType.VARIANT_MANAGEMENT,
            ToolType.VARIANT_EDIT
        ];

        this._myTools = [];
        this._initializeTools(meshObject, pointer);

        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;
        this._myToolLabel = toolLabel.pp_getComponent("text");

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }

    update(dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd()) {
            let newToolIndex = (this._myActiveToolIndex + 1) % this._myToolOrder.length;

            this._myTools[this._myToolOrder[this._myActiveToolIndex]].end();
            this._myTools[this._myToolOrder[newToolIndex]].start();

            this._myActiveToolIndex = newToolIndex;

            this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
        }

        let currentTool = this._myTools[this._myToolOrder[this._myActiveToolIndex]];
        currentTool.update(dt);
    }

    _initializeTools(meshObject, pointer) {
        this._myTools[ToolType.FREE_EDIT] = new FreeEditTool(meshObject, pointer);
        this._myTools[ToolType.GROUP_MANAGEMENT] = new DummyTool(meshObject, pointer);
        this._myTools[ToolType.VARIANT_MANAGEMENT] = new DummyTool(meshObject, pointer);
        this._myTools[ToolType.VARIANT_EDIT] = new DummyTool(meshObject, pointer);
    }
};