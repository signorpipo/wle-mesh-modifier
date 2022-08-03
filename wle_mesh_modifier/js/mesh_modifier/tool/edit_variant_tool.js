EditVariantTool = class EditVariantTool extends FreeEditTool {
    constructor(toolData) {
        super(toolData);

        this._myVariantCreatedCallbacks = new Map();
        this._myVariantEditedCallbacks = new Map();
    }

    start() {
        super.start();

        if (this._myToolData.mySelectedVertexGroup != null) {
            this._selectAllGroupVertex();
        }
    }

    update(dt) {
        if (this._myToolData.mySelectedVertexGroup == null) {
            return;
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._createVariant();
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(2)) {
            this._editVariant();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(3)) {
            this._resetAllVertexes();
        }

        super.update(dt);
    }

    _isSelectedVertexValid(selectedVertexParams) {
        let selectedIndex = selectedVertexParams.getIndexes()[0];
        return this._myToolData.mySelectedVertexGroup.getIndexList().pp_hasEqual(selectedIndex);
    }

    _resetAll() {
        this._resetGroupVertexes();
    }

    _selectAll() {
        this._selectAllGroupVertex();
    }

    _setupControlScheme() {
        super._setupControlScheme();
        let leftScheme = this._myToolData.myLeftControlScheme;
        leftScheme.setTopButtonText("x2: Save Current Variant");
        leftScheme.setBottomButtonText("x2: Save As New Variant");

        let rightScheme = this._myToolData.myRightControlScheme;
        rightScheme.setSelectText("x1: Select Vertex\n x2: Select All Group Vertexes");
        rightScheme.setBottomButtonText("x1: Reset Vertex\n x2: Reset All Group Vertexes\n x3: Reset All Vertexes");
        rightScheme.setTopButtonText("x1: Deselect Vertex\n x2: Deselect All Vertexes");
    }

    _debugDraw() {
        if (this._myToolData.myIsPlayingAnimation) return;

        if (this._myToolData.mySelectedVertexGroup == null) {
            this._myToolData.myVertexGroupConfig.debugDraw(this._myToolData.myMeshComponent);
        } else {
            this._myToolData.mySelectedVertexGroup.debugDraw(this._myToolData.myMeshComponent);
        }

        let color = null;
        if (this._myToolData.mySelectedVertexGroup != null) {
            color = randomColor(this._myToolData.mySelectedVertexGroup.getID());
        }
        for (let selectedVertex of this._myToolData.mySelectedVertexes) {
            selectedVertex.debugDraw(color);
        }
    }

    registerVariantCreatedEventListener(id, callback) {
        this._myVariantCreatedCallbacks.set(id, callback);
    }

    unregisterVariantCreatedEventListener(id) {
        this._myVariantCreatedCallbacks.delete(id);
    }

    registerVariantEditedEventListener(id, callback) {
        this._myVariantEditedCallbacks.set(id, callback);
    }

    unregisterVariantEditedEventListener(id) {
        this._myVariantEditedCallbacks.delete(id);
    }
};