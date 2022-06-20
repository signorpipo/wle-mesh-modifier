ToolManager = class ToolManager {
    constructor(meshObject, pointer, toolLabel, vertexGroupConfigPath) {
        this._myActiveToolIndex = 0;

        this._myToolOrder = [
            ToolType.FREE_EDIT,
            ToolType.GROUP_MANAGEMENT,
            ToolType.VARIANT_MANAGEMENT,
            ToolType.VARIANT_EDIT
        ];

        this._myStarted = false;
        this._myVertexGroupConfig = null;

        this._loadVertexGroupConfig(vertexGroupConfigPath);

        this._myTools = [];

        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;
        this._myToolLabel = toolLabel.pp_getComponent("text");
    }

    update(dt) {
        if (this._myStarted) {
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
    }

    _initializeTools() {
        this._myTools = [];

        this._myTools[ToolType.FREE_EDIT] = new FreeEditTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.GROUP_MANAGEMENT] = new DummyTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.VARIANT_MANAGEMENT] = new DummyTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.VARIANT_EDIT] = new DummyTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);

        this._myActiveToolIndex = 0;

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }

    _loadVertexGroupConfig(vertexGroupConfigPath) {
        loadFileJSON(vertexGroupConfigPath,
            function (jsonObject) {
                this._myVertexGroupConfig = new VertexGroupConfig();
                try {
                    this._myVertexGroupConfig.fromJSONObject(jsonObject);
                } catch (error) {
                    this._myVertexGroupConfig = new VertexGroupConfig();
                }

                this._initializeTools();

                this._myStarted = true;
            }.bind(this),
            function (response) {
                this._myVertexGroupConfig = new VertexGroupConfig();

                this._initializeTools();

                this._myStarted = true;
            }.bind(this)
        );
    }
};