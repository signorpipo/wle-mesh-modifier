PP.EasyTuneBoolArrayWidgetSetup = class EasyTuneBoolArrayWidgetSetup extends PP.EasyTuneBaseWidgetSetup {

    constructor(arraySize) {
        super();

        this.myArraySize = arraySize;
    }

    _getBackPanelMinY() {
        let valuePanelLastPosition = (this.myValuePanelsPositions[this.myArraySize - 1]) ? this.myValuePanelsPositions[this.myArraySize - 1][1] : 0;
        return super._getBackPanelMinY() + this.myValuesPanelPosition[1] + valuePanelLastPosition;
    }

    _getPivotZOffset() {
        return 0.00802713;
    }

    _initializeBuildSetupHook() {
        this.myIncreaseButtonText = "+";
        this.myDecreaseButtonText = "-";

        this._myValuePanelDistanceFromVariableLabelPanel = 0.055;
        this._myDistanceBetweenValues = this.mySideButtonBackgroundScale[1] * 2 + 0.015;

        this.myValuesPanelPosition = [0, this.myVariableLabelPanelPosition[1] - this._myValuePanelDistanceFromVariableLabelPanel, this._myPanelZOffset];

        this.myValueTextScale = [0.4, 0.4, 0.4];

        this.myValueCursorTargetPosition = [0, 0, 0];
        this.myValueCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.myValueCollisionExtents = [0.065, 0.02, 1];
        this.myValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myValuePanelsPositions = [];
        this.myValuePanelsPositions[0] = [0, 0, 0];
        for (let i = 1; i < this.myArraySize; i++) {
            this.myValuePanelsPositions[i] = this.myValuePanelsPositions[i - 1].slice(0);
            this.myValuePanelsPositions[i][1] -= this._myDistanceBetweenValues;
        }
    }

    _initializeRuntimeSetupHook() {
        this.myTextHoverScaleMultiplier = [1.25, 1.25, 1.25];

        this.myThumbstickToggleThreshold = 0.6;
        this.myButtonEditDelay = 0;
    }
};