ManageGroupsTool = class ManageGroupsTool {
    constructor(meshObject, pointer, vertexGroupConfig) {
        this._myMeshObject = meshObject;
        this._myPointerObject = pointer;
        this._myVertexGroupConfig = vertexGroupConfig;

        this._myMeshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");

        this._myVertexDataBackup = [];
        for (let vertex of this._myMeshComponent.mesh.vertexData) {
            this._myVertexDataBackup.push(vertex);
        }

        this._mySelectedVertexes = [];

        this._myMinDistanceToSelect = 0.025;

        this._mySelectedVertexGroup = null;
    }

    start() {
        this._mySelectedVertexes = [];
    }

    end() {
        this._mySelectedVertexes = [];
    }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressed()) {
            this._selectVertex();
        }

        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressed()) {
            this._deselectVertex();
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            this._mySelectedVertexes = [];
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(2)) {
            this._saveGroup();
        }

        this._debugDraw();
    }

    _selectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, this._myPointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }

    _deselectVertex() {
        let pointerPosition = this._myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myMeshObject, this._myPointerObject);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _saveGroup() {
        let indexList = [];
        for (let selectedVertex of this._mySelectedVertexes) {
            let selectedIndexList = selectedVertex.getIndexes();
            indexList.push(...selectedIndexList);
        }

        if (indexList.length > 0) {
            if (this._mySelectedVertexGroup == null) {
                this._mySelectedVertexGroup = this._myVertexGroupConfig.addGroup();
            }

            this._mySelectedVertexGroup.setIndexList(indexList);
        }
    }

    _debugDraw() {
        if (this._mySelectedVertexGroup == null) {
            this._myVertexGroupConfig.debugDraw(this._myMeshComponent);
        } else {
            this._mySelectedVertexGroup.debugDraw(this._myMeshComponent);
        }

        let color = null;
        if (this._mySelectedVertexGroup != null) {
            color = randomColor(this._mySelectedVertexGroup.getID());
        }
        for (let selectedVertex of this._mySelectedVertexes) {
            selectedVertex.debugDraw(color);
        }
    }
};