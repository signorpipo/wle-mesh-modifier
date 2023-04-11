import { AnimationComponent } from "@wonderlandengine/api";
import { GamepadButtonID, getLeftGamepad, getRightGamepad } from "../../../pp";
import { VertexUtils } from "../../vertex_utils";

export class IndexToolData {
    constructor(mesh) {
        this.myMeshObject = null;
        this.myIsFlatShading = true;

        this.myMeshComponent = null;
        this.myMeshAnimationObject = null;
        this.myAnimationToPlay = null;
        this.myRestPoseAnimation = null;

        this.myPointerObject = null;

        this.myIsPlayingAnimation = false;

        this.mySelectedVertexes = [];
        this.myVertexDataBackup = mesh.vertexData.pp_clone();
        this.myIndexDataBackup = mesh.indexData.pp_clone();

        this.myLeftControlScheme = null;
        this.myRightControlScheme = null;
    }
}

export class IndexTool {
    constructor(toolData) {
        this._myToolData = toolData;

        this._myMinDistanceToSelect = 0.025;
    }

    reset() {
        this._myToolData.mySelectedVertexes = [];

        if (this._myToolData.myIsPlayingAnimation) {
            if (this._myToolData.myMeshAnimationObject != null) {
                let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponent(AnimationComponent);
                if (animationComponent) {
                    animationComponent.stop();
                    animationComponent.animation = this._myToolData.myRestPoseAnimation;
                    animationComponent.play();
                }
            }
        }
    }

    start() {
        this._setupControlScheme();
    }

    end() { }

    update(dt) {
        if (getRightGamepad().getButtonInfo(GamepadButtonID.THUMBSTICK).isPressEnd()) {
            this._myToolData.myLeftControlScheme.setVisible(!this._myToolData.myLeftControlScheme.isVisible());
            this._myToolData.myRightControlScheme.setVisible(!this._myToolData.myRightControlScheme.isVisible());
        }

        if (getLeftGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd(2)) {
            if (this._myToolData.myMeshAnimationObject != null) {
                let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponent(AnimationComponent);
                if (animationComponent) {
                    animationComponent.stop();
                    if (this._myToolData.myIsPlayingAnimation) {
                        animationComponent.animation = this._myToolData.myRestPoseAnimation;
                    } else {
                        animationComponent.animation = this._myToolData.myAnimationToPlay;
                    }
                    animationComponent.play();
                    this._myToolData.myIsPlayingAnimation = !this._myToolData.myIsPlayingAnimation;
                }
            }
        }

        this._previewVertexDebugDraw();
    }

    _previewVertexDebugDraw() {
        if (this._myToolData.myIsPlayingAnimation) return;

        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            if (this._isSelectedVertexValid(selectedVertexParams)) {
                selectedVertexParams.debugDraw(null, true);
            }
        }

    }

    _setupControlScheme() {

    }

    // Selection
    _selectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            if (this._isSelectedVertexValid(selectedVertexParams)) {
                this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
            }
        }
    }

    _isSelectedVertexValid(selectedVertexParams) {
        return true;
    }

    _deselectVertex() {
        let pointerPosition = this._myToolData.myPointerObject.pp_getPosition();

        let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, pointerPosition, this._myToolData.myVertexDataBackup);

        let vertexPositionWorld = selectedVertexParams.getPosition();
        if (vertexPositionWorld.vec3_distance(pointerPosition) < this._myMinDistanceToSelect) {
            this._myToolData.mySelectedVertexes.pp_removeAll(element => element.equals(selectedVertexParams));
        }
    }

    _selectAll() {
        this._myToolData.mySelectedVertexes = [];
        let meshTransform = this._myToolData.myMeshComponent.object.pp_getTransform();

        let vertexCount = mesh.vertexCount;
        for (let i = 0; i < vertexCount; i++) {
            let vertexPosition = VertexUtils.getVertexPosition(i, this._myToolData.myMeshComponent.mesh);
            let vertexPositionWorld = vertexPosition.vec3_convertPositionToWorld(meshTransform);

            let selectedVertexParams = VertexUtils.getClosestSelectedVertex(this._myToolData.myMeshObject, vertexPositionWorld, this._myToolData.myVertexDataBackup);
            this._myToolData.mySelectedVertexes.pp_pushUnique(selectedVertexParams, element => element.equals(selectedVertexParams));
        }
    }


    // Reset
    _resetAllIndexes() {
        VertexUtils.resetMeshIndexData(this._myToolData.myMeshComponent, this._myToolData.myIndexDataBackup);

        this._myToolData.myMeshObject.pp_setActive(false);
    }

    // Delete
    _deleteSelectedVertexesFromIndexData() {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.deleteSelectedVertexesFromIndexData(this._myToolData.myMeshComponent, this._myToolData.mySelectedVertexes);

            this._myToolData.myMeshObject.pp_setActive(false);
        }
    }

    // Hide
    _hideSelectedVertexesFromIndexData() {
        if (this._myToolData.mySelectedVertexes.length > 0) {
            VertexUtils.hideSelectedVertexesFromIndexData(this._myToolData.myMeshComponent, this._myToolData.mySelectedVertexes);

            this._myToolData.myMeshObject.pp_setActive(false);
        }
    }
}