EditVariantTool = class EditVariantTool extends FreeEditTool {
    constructor(toolData) {
        super(toolData);

        this._myVariantSavedCallbacks = new Map();
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
            this._saveVariant();
        }

        super.update(dt);
    }

    _isSelectedVertexValid(selectedVertexParams) {
        let selectedIndex = selectedVertexParams.getIndexes()[0];
        return this._myToolData.mySelectedVertexGroup.getIndexList().pp_hasEqual(selectedIndex);
    }

    _debugDraw() {
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

    registerVariantSavedEventListener(id, callback) {
        this._myVariantSavedCallbacks.set(id, callback);
    }

    unregisterVariantSavedEventListener(id) {
        this._myVariantSavedCallbacks.delete(id);
    }
};