IndexToolData = class IndexToolData {
    constructor(mesh) {
        this.myMeshObject = null;
        this.myIsFlatShading = true;

        this.myMeshComponent = null;
        this.myMeshAnimationObject = null;
        this.myAnimationToPlay = null;
        this.myAPoseAnimation = null;

        this.myPointerObject = null;

        this.myIsPlayingAnimation = false;

        this.myIndexDataBackup = [];
        for (let index of mesh.indexData) {
            this.myIndexDataBackup.push(index);
        }

        this.myLeftControlScheme = null;
        this.myRightControlScheme = null;
    }
};

IndexTool = class IndexTool {
    constructor(toolData) {
        this._myToolData = toolData;

        this._myMinDistanceToSelect = 0.025;
    }

    reset() {
        if (this._myToolData.myIsPlayingAnimation) {
            let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponentHierarchy("animation");
            animationComponent.stop();
            animationComponent.animation = this._myToolData.myAPoseAnimation;
            animationComponent.play();
        }
    }

    start() {
        this._setupControlScheme();
    }

    end() { }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).isPressEnd()) {
            this._myToolData.myLeftControlScheme.setVisible(!this._myToolData.myLeftControlScheme.isVisible());
            this._myToolData.myRightControlScheme.setVisible(!this._myToolData.myRightControlScheme.isVisible());
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(2)) {
            let animationComponent = this._myToolData.myMeshAnimationObject.pp_getComponentHierarchy("animation");
            animationComponent.stop();
            if (this._myToolData.myIsPlayingAnimation) {
                animationComponent.animation = this._myToolData.myAPoseAnimation;
            } else {
                animationComponent.animation = this._myToolData.myAnimationToPlay;
            }
            animationComponent.play();
            this._myToolData.myIsPlayingAnimation = !this._myToolData.myIsPlayingAnimation;
        }
    }

    _setupControlScheme() {

    }
};