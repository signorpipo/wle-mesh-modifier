ToolData = class ToolData {
    constructor(mesh) {
        this.myMeshObject = null;
        this.myIsFlatShading = true;
        this.myMeshComponent = null;
        this.myPointerObject = null;
        this.myVertexGroupConfig = null;

        this.mySelectedVertexes = [];
        this.mySelectedVertexGroup = null;
        this.mySelectedVertexVariant = null;
        this.myVertexDataBackup = [];
        for (let vertex of mesh.vertexData) {
            this.myVertexDataBackup.push(vertex);
        }

        this.myLeftControlScheme = null;
        this.myRightControlScheme = null;
    }
};

ToolManagerParams = class ToolManagerParams {
    constructor() {
        this.myMeshObject = null;
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
        this._myActiveToolIndex = 0;

        this._myToolOrder = [
            ToolType.FREE_EDIT,
            ToolType.GROUP_MANAGEMENT,
            ToolType.VARIANT_MANAGEMENT,
            ToolType.VARIANT_EDIT
        ];

        this._myStarted = false;

        this._myTools = [];

        this._myToolLabel = params.myToolLabel.pp_getComponent("text");
        this._myGroupLabel = params.myGroupLabel.pp_getComponent("text");
        this._myVariantLabel = params.myVariantLabel.pp_getComponent("text");
        this._myResetToolLabelTimer = new PP.Timer(2, false);

        let meshComponent = params.myMeshObject.pp_getComponentHierarchy("mesh");
        this._myToolData = new ToolData(meshComponent.mesh);
        this._myToolData.myMeshObject = params.myMeshObject;
        this._myToolData.myIsFlatShading = params.myIsFlatShading;
        this._myToolData.myMeshComponent = meshComponent;
        this._myToolData.myPointerObject = params.myPointerObject;
        this._myToolData.myLeftControlScheme = params.myLeftControlScheme;
        this._myToolData.myRightControlScheme = params.myRightControlScheme;

        this._loadVertexGroupConfig(params.myVariantGroupCongigPath);

        this._myScrollEnabled = true;

        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.POINT, 1000);
        PP.myDebugManager.allocateDraw(PP.DebugDrawObjectType.ARROW, 1000);

        this._myEnableMeshCounter = 0;
    }

    update(dt) {
        if (this._myStarted) {
            let axes = PP.myLeftGamepad.getAxesInfo().getAxes();
            if (Math.abs(axes[0]) > 0.5 && !PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressed()) {
                if (this._myScrollEnabled) {
                    let newToolIndex = (this._myActiveToolIndex + 1 * Math.pp_sign(axes[0])) % this._myToolOrder.length;
                    if (newToolIndex < 0) {
                        newToolIndex = this._myToolOrder.length + newToolIndex;
                    }

                    this._myTools[this._myToolOrder[this._myActiveToolIndex]].end();
                    this._myTools[this._myToolOrder[newToolIndex]].start();

                    this._myActiveToolIndex = newToolIndex;

                    this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];

                    this._myScrollEnabled = false;
                }
            } else {
                this._myScrollEnabled = true;
            }

            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd(2)) {
                let configText = jsonStringify(this._myToolData.myVertexGroupConfig);
                downloadFileText("vertex_group_config.json", jsonStringify(this._myToolData.myVertexGroupConfig));

                console.log("Vertex Group Config:");
                console.log(configText);

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

            if (this._myToolData.mySelectedVertexGroup != null) {
                this._myGroupLabel.text = "Group: " + this._myToolData.mySelectedVertexGroup.getID();
            } else {
                this._myGroupLabel.text = "Group: None";
            }

            if (this._myToolData.mySelectedVertexVariant != null) {
                this._myVariantLabel.text = "Variant: " + this._myToolData.mySelectedVertexVariant.getID();
            } else {
                this._myVariantLabel.text = "Variant: None";
            }

            if (this._myEnableMeshCounter > 0) {
                this._myEnableMeshCounter--;
                if (this._myEnableMeshCounter == 0) {
                    this._myToolData.myMeshComponent.active = true;
                }
            }

            if (!this._myToolData.myMeshComponent.active && this._myEnableMeshCounter == 0) {
                this._myEnableMeshCounter = 2;
            } else if (this._myToolData.myMeshComponent.active) {
                this._myEnableMeshCounter = 0;
            }
        }
    }

    _initializeTools() {
        this._myTools = [];

        this._myTools[ToolType.FREE_EDIT] = new FreeEditTool(this._myToolData);
        this._myTools[ToolType.GROUP_MANAGEMENT] = new ManageGroupsTool(this._myToolData);
        this._myTools[ToolType.VARIANT_MANAGEMENT] = new ManageVariantsTool(this._myToolData);
        this._myTools[ToolType.VARIANT_EDIT] = new EditVariantTool(this._myToolData);

        this._myTools[ToolType.GROUP_MANAGEMENT].registerGroupSavedEventListener(this, this._onGroupSaved.bind(this));
        this._myTools[ToolType.VARIANT_MANAGEMENT].registerEditVariantEventListener(this, this._onEditVariant.bind(this));
        this._myTools[ToolType.VARIANT_EDIT].registerVariantCreatedEventListener(this, this._onVariantCreated.bind(this));
        this._myTools[ToolType.VARIANT_EDIT].registerVariantEditedEventListener(this, this._onVariantEdited.bind(this));

        this._myActiveToolIndex = 0;

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }

    _loadVertexGroupConfig(vertexGroupConfigPath) {
        loadFileText(vertexGroupConfigPath,
            function (text) {
                this._myToolData.myVertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
                    this._myToolData.myVertexGroupConfig.fromJSONObject(jsonObject);
                } catch (error) {
                    this._myToolData.myVertexGroupConfig = new VertexGroupConfig();
                }

                this._initializeTools();

                this._myStarted = true;
            }.bind(this),
            function (response) {
                this._myToolData.myVertexGroupConfig = new VertexGroupConfig();

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
        this._myActiveToolIndex = this._myToolOrder.pp_findIndexEqual(ToolType.VARIANT_EDIT);

        this._myTools[this._myToolOrder[this._myActiveToolIndex]].start();
        this._myToolLabel.text = this._myToolOrder[this._myActiveToolIndex];
    }
};