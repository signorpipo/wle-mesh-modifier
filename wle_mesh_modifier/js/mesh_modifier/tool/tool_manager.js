ToolManagerParams = class ToolManagerParams {
    constructor() {
        this.myMeshObject = null;
        this.myMeshAnimationObject = null;
        this.myAnimationToPlay = null;
        this.myAPoseAnimation = null;

        this.myIsFlatShading = true;
        this.myPointerObject = null;
        this.myToolLabel = null;
        this.myGroupLabel = null;
        this.myVariantLabel = null;
        this.myVariantGroupCongigPath = null;
        this.myLeftControlScheme = null;
        this.myRightControlScheme = null;
    }
};

ToolManager = class ToolManager {
    constructor(params) {
        this._myActiveToolGroupIndex = 0;
        this._myActiveToolIndex = 0;

        this._myToolGroupOrder = [
            ToolGroupType.VERTEX,
            ToolGroupType.INDEX
        ];

        this._myToolOrder = [];
        this._myToolOrder[ToolGroupType.VERTEX] =
            [
                ToolType.VERTEX_FREE_EDIT,
                ToolType.VERTEX_GROUP_MANAGEMENT,
                ToolType.VERTEX_VARIANT_MANAGEMENT,
                ToolType.VERTEX_VARIANT_EDIT
            ];
        this._myToolOrder[ToolGroupType.INDEX] =
            [
                ToolType.INDEX_FREE_EDIT
            ];

        this._myStarted = false;

        this._myTools = [];

        this._myToolLabel = params.myToolLabel.pp_getComponent("text");
        this._myGroupLabel = params.myGroupLabel.pp_getComponent("text");
        this._myVariantLabel = params.myVariantLabel.pp_getComponent("text");
        this._myResetToolLabelTimer = new PP.Timer(2, false);

        let meshComponent = params.myMeshObject.pp_getComponentHierarchy("mesh");

        this._myVertexToolData = new VertexToolData(meshComponent.mesh);
        this._myVertexToolData.myMeshObject = params.myMeshObject;
        this._myVertexToolData.myMeshAnimationObject = params.myMeshAnimationObject;
        this._myVertexToolData.myAnimationToPlay = params.myAnimationToPlay;
        this._myVertexToolData.myAPoseAnimation = params.myAPoseAnimation;
        this._myVertexToolData.myIsFlatShading = params.myIsFlatShading;
        this._myVertexToolData.myMeshComponent = meshComponent;
        this._myVertexToolData.myPointerObject = params.myPointerObject;
        this._myVertexToolData.myLeftControlScheme = params.myLeftControlScheme;
        this._myVertexToolData.myRightControlScheme = params.myRightControlScheme;
        this._loadVertexGroupConfig(params.myVariantGroupCongigPath);

        this._myScrollEnabled = true;

        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.POINT, 1000);
        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.ARROW, 1000);
    }

    update(dt) {
        if (this._myStarted) {
            let axes = PP.myLeftGamepad.getAxesInfo().getAxes();
            if (!PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
                if (Math.abs(axes[0]) > 0.5) {
                    if (this._myScrollEnabled) {
                        let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
                        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].end();

                        let newToolIndex = (this._myActiveToolIndex + 1 * Math.pp_sign(axes[0])) % this._myToolOrder[currentGroup].length;
                        if (newToolIndex < 0) {
                            newToolIndex = this._myToolOrder[currentGroup].length + newToolIndex;
                        }

                        this._myActiveToolIndex = newToolIndex;
                        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].start();
                        this._myToolLabel.text = this._myToolOrder[currentGroup][this._myActiveToolIndex];

                        this._myScrollEnabled = false;
                    }
                } else if (Math.abs(axes[1]) > 0.5) {
                    if (this._myScrollEnabled) {
                        let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
                        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].end();
                        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].reset();

                        let newToolGroupIndex = (this._myActiveToolGroupIndex + 1 * Math.pp_sign(axes[1])) % this._myToolGroupOrder.length;
                        if (newToolGroupIndex < 0) {
                            newToolGroupIndex = this._myToolGroupOrder.length + newToolGroupIndex;
                        }

                        this._myActiveToolGroupIndex = newToolGroupIndex;
                        this._myActiveToolIndex = 0;

                        let newGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
                        this._myTools[this._myToolOrder[newGroup][this._myActiveToolIndex]].reset();
                        this._myTools[this._myToolOrder[newGroup][this._myActiveToolIndex]].start();
                        this._myToolLabel.text = this._myToolOrder[newGroup][this._myActiveToolIndex];

                        this._myScrollEnabled = false;
                    }
                } else {
                    this._myScrollEnabled = true;
                }
            } else {
                this._myScrollEnabled = Math.abs(axes[0]) < 0.5 && Math.abs(axes[1]) < 0.5;
            }

            let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
            let currentTool = this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]];
            currentTool.update(dt);

            this._vertexToolExtraUpdate();

            if (this._myResetToolLabelTimer.isRunning()) {
                this._myResetToolLabelTimer.update(dt);
                if (this._myResetToolLabelTimer.isDone()) {
                    let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
                    this._myToolLabel.text = this._myToolOrder[currentGroup][this._myActiveToolIndex];
                }
            }
        }
    }

    _initializeTools() {
        this._myTools = [];

        this._myTools[ToolType.VERTEX_FREE_EDIT] = new VertexFreeEditTool(this._myVertexToolData);
        this._myTools[ToolType.VERTEX_GROUP_MANAGEMENT] = new VertexManageGroupsTool(this._myVertexToolData);
        this._myTools[ToolType.VERTEX_VARIANT_MANAGEMENT] = new VertexManageVariantsTool(this._myVertexToolData);
        this._myTools[ToolType.VERTEX_VARIANT_EDIT] = new VertexEditVariantTool(this._myVertexToolData);
        this._myTools[ToolType.INDEX_FREE_EDIT] = new IndexFreeEditTool(this._myVertexToolData);

        this._myTools[ToolType.VERTEX_GROUP_MANAGEMENT].registerGroupSavedEventListener(this, this._onGroupSaved.bind(this));
        this._myTools[ToolType.VERTEX_VARIANT_MANAGEMENT].registerEditVariantEventListener(this, this._onEditVariant.bind(this));
        this._myTools[ToolType.VERTEX_VARIANT_EDIT].registerVariantCreatedEventListener(this, this._onVariantCreated.bind(this));
        this._myTools[ToolType.VERTEX_VARIANT_EDIT].registerVariantEditedEventListener(this, this._onVariantEdited.bind(this));

        this._myActiveToolGroupIndex = 0;
        this._myActiveToolIndex = 0;

        let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[currentGroup][this._myActiveToolIndex];
    }

    _loadVertexGroupConfig(vertexGroupConfigPath) {
        loadFileText(vertexGroupConfigPath,
            function (text) {
                this._myVertexToolData.myVertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
                    this._myVertexToolData.myVertexGroupConfig.fromJSONObject(jsonObject);
                } catch (error) {
                    this._myVertexToolData.myVertexGroupConfig = new VertexGroupConfig();
                }

                this._initializeTools();

                this._myStarted = true;
            }.bind(this),
            function (response) {
                this._myVertexToolData.myVertexGroupConfig = new VertexGroupConfig();

                this._initializeTools();

                this._myStarted = true;
            }.bind(this)
        );
    }

    _onGroupSaved() {
        this._myToolLabel.text = "Group Saved";
        this._myResetToolLabelTimer.start();
    }

    _onVariantCreated() {
        this._myToolLabel.text = "Variant Created";
        this._myResetToolLabelTimer.start();
    }

    _onVariantEdited() {
        this._myToolLabel.text = "Variant Edited";
        this._myResetToolLabelTimer.start();
    }

    _onEditVariant() {
        this._myActiveToolGroupIndex = this._myToolGroupOrder.pp_findIndexEqual(ToolType.VERTEX);
        let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
        this._myActiveToolIndex = this._myToolOrder[currentGroup].pp_findIndexEqual(ToolType.VERTEX_VARIANT_EDIT);

        this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[currentGroup][this._myActiveToolIndex];
    }

    _vertexToolExtraUpdate() {
        // #TODO this should be moved inside the vertex tool

        let currentGroup = this._myToolGroupOrder[this._myActiveToolGroupIndex];
        if (currentGroup == ToolGroupType.VERTEX) {
            let vertexToolData = this._myTools[this._myToolOrder[currentGroup][this._myActiveToolIndex]].getToolData();

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd(2)) {
                let configText = jsonStringify(vertexToolData.myVertexGroupConfig);
                downloadFileText("vertex_group_config.json", jsonStringify(vertexToolData.myVertexGroupConfig));

                console.log("Vertex Group Config:");
                console.log(configText);

                this._myToolLabel.text = "Config Downloaded";
                this._myResetToolLabelTimer.start();
            }

            if (vertexToolData.mySelectedVertexGroup != null) {
                this._myGroupLabel.text = "Group: " + vertexToolData.mySelectedVertexGroup.getID();
            } else {
                this._myGroupLabel.text = "Group: None";
            }

            if (vertexToolData.mySelectedVertexVariant != null) {
                this._myVariantLabel.text = "Variant: " + vertexToolData.mySelectedVertexVariant.getID();
            } else {
                this._myVariantLabel.text = "Variant: None";
            }
        } else {
            this._myGroupLabel.text = "";
            this._myVariantLabel.text = "";
        }
    }
};