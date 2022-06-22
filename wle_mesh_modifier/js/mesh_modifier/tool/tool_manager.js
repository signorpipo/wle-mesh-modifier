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
        this._myResetToolLabelTimer = new PP.Timer(2, false);

        this._myNextActive = true;

        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.POINT, 1000);
        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.ARROW, 1000);
    }

    update(dt) {
        if (this._myStarted) {
            let axes = PP.myLeftGamepad.getAxesInfo().getAxes();
            if (Math.abs(axes[0]) > 0.5) {
                if (this._myNextActive) {
                    let newToolIndex = (this._myActiveToolIndex + 1 * Math.pp_sign(axes[0])) % this._myToolOrder.length;
                    if (newToolIndex < 0) {
                        newToolIndex = this._myToolOrder.length + newToolIndex;
                    }

                    this._myTools[this._myToolOrder[this._myActiveToolIndex]].end();
                    this._myTools[this._myToolOrder[newToolIndex]].start();

                    this._myActiveToolIndex = newToolIndex;

                    this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];

                    this._myNextActive = false;
                }
            } else {
                this._myNextActive = true;
            }

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd(2)) {
                downloadFileText("vertex_group_config.json", jsonStringify(this._myVertexGroupConfig));

                this._myToolLabel.text = "Config Downloaded";
                this._myResetToolLabelTimer.start();
            }

            let currentTool = this._myTools[this._myToolOrder[this._myActiveToolIndex]];
            currentTool.update(dt);

            if (this._myResetToolLabelTimer.isRunning()) {
                this._myResetToolLabelTimer.update(dt);
                if (this._myResetToolLabelTimer.isDone()) {
                    this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
                }
            }
        }
    }

    _initializeTools() {
        this._myTools = [];

        this._myTools[ToolType.FREE_EDIT] = new FreeEditTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.GROUP_MANAGEMENT] = new ManageGroupsTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.VARIANT_MANAGEMENT] = new ManageVariantsTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);
        this._myTools[ToolType.VARIANT_EDIT] = new EditVariantTool(this._myMeshObject, this._myPointerObject, this._myVertexGroupConfig);

        this._myTools[ToolType.GROUP_MANAGEMENT].registerGroupSavedEventListener(this, this._onGroupSaved.bind(this));
        this._myTools[ToolType.VARIANT_MANAGEMENT].registerEditVariantEventListener(this, this._onEditVariant.bind(this));
        this._myTools[ToolType.VARIANT_EDIT].registerVariantSavedEventListener(this, this._onVariantSaved.bind(this));

        this._myActiveToolIndex = 0;

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }

    _loadVertexGroupConfig(vertexGroupConfigPath) {
        loadFileText(vertexGroupConfigPath,
            function (text) {
                this._myVertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
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

    _onGroupSaved() {
        this._myToolLabel.text = "Group Saved";
        this._myResetToolLabelTimer.start();
    }

    _onVariantSaved() {
        this._myToolLabel.text = "Variant Saved";
        this._myResetToolLabelTimer.start();
    }

    _onEditVariant(group, variant) {
        this._myActiveToolIndex = this._myToolOrder.pp_findIndexEqual(ToolType.VARIANT_EDIT);

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start(group, variant);
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }
};