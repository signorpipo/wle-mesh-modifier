PP.EasyTuneNoneWidgetSetup = class EasyTuneNoneWidgetSetup extends PP.EasyTuneBaseWidgetSetup {

    _getBackPanelMinY() {
        return super._getBackPanelMinY() + this.myTypeNotSupportedPanelPosition[1];
    }

    _getPivotZOffset() {
        return 0.00804713;
    }

    _initializeBuildSetupHook() {
        this.myTypeNotSupportedPanelPosition = [0, -0.03, this._myPanelZOffset];
        this.myTypeNotSupportedTextScale = [0.275, 0.275, 0.275];
        this.myTypeNotSupportedText = "Type Not Supported";
    }
};