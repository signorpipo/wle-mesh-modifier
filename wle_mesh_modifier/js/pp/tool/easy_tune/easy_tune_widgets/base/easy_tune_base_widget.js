import { Timer } from "../../../../cauldron/cauldron/timer";

export class EasyTuneBaseWidgetParams {

    constructor() {
        this.myVariablesImportCallback = null;   // Signature: callback()
        this.myVariablesExportCallback = null;   // Signature: callback()
    }
}

export class EasyTuneBaseWidget {

    constructor(params) {
        this._myConfig = null;
        this._myUI = null;

        this._myParams = params;
        this._myParams = null;

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();     // Signature: callback(scrollAmount)

        this._myAppendToVariableName = "";

        this._myScrollVariableActive = false;
        this._myScrollDirection = 0;
        this._myScrollVariableTimer = 0;
        this._myHasScrolled = false;

        this._myResetImportLabelTimer = new Timer(0, false);
        this._myResetExportLabelTimer = new Timer(0, false);
    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }

        this._myUI.setVisible(visible);

        this._myIsVisible = visible;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;

        if ((typeof appendToVariableName) !== undefined) {
            this._myAppendToVariableName = appendToVariableName;
        } else {
            this._myAppendToVariableName = "";
        }

        this._setEasyTuneVariableHook();

        this._refreshUI();
    }

    isScrollVariableActive() {
        return this._myScrollVariableActive;
    }

    getScrollVariableDirection() {
        return this._myScrollDirection;
    }

    setScrollVariableActive(active, scrollDirection) {
        this._myScrollVariableActive = active;
        this._myScrollDirection = scrollDirection;
        this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
        this._myHasScrolled = false;
    }

    getWidget() {
        return this;
    }

    syncWidget(otherEasyTuneWidget) {
        if (otherEasyTuneWidget != null) {
            if (otherEasyTuneWidget._myResetImportLabelTimer.isRunning()) {
                this._myResetImportLabelTimer.start(otherEasyTuneWidget._myResetImportLabelTimer.getTimeLeft());
            } else {
                this._myResetImportLabelTimer.reset();
            }

            if (otherEasyTuneWidget._myResetExportLabelTimer.isRunning()) {
                this._myResetExportLabelTimer.start(otherEasyTuneWidget._myResetExportLabelTimer.getTimeLeft());
            } else {
                this._myResetExportLabelTimer.reset();
            }

            this._myUI.myImportButtonTextComponent.text = otherEasyTuneWidget._myUI.myImportButtonTextComponent.text;
            this._myUI.myExportButtonTextComponent.text = otherEasyTuneWidget._myUI.myExportButtonTextComponent.text;

            this.setScrollVariableActive(otherEasyTuneWidget.isScrollVariableActive(), otherEasyTuneWidget.getScrollVariableDirection());
        } else {
            this._myResetImportLabelTimer.reset();
            this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportButtonText;

            this._myResetExportLabelTimer.reset();
            this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportButtonText;
        }
    }

    onImportSuccess() {
        this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportSuccessButtonText;
        this._myResetImportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onImportFailure() {
        this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportFailureButtonText;
        this._myResetImportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onExportSuccess() {
        this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportSuccessButtonText;
        this._myResetExportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onExportFailure() {
        this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportFailureButtonText;
        this._myResetExportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    registerScrollVariableRequestEventListener(id, callback) {
        this._myScrollVariableRequestCallbacks.set(id, callback);
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestCallbacks.delete(id);
    }

    start(parentObject, params) {
        this._myParams = params;

        this._myConfig.build();

        this._myResetImportLabelTimer.setDuration(this._myConfig.myImportExportResetLabelSeconds);
        this._myResetExportLabelTimer.setDuration(this._myConfig.myImportExportResetLabelSeconds);

        this._myUI.build(parentObject, this._myConfig, params);
        this._myUI.setImportExportButtonsActive(this._myParams.myVariablesImportExportButtonsEnabled);

        this._startHook(parentObject, params);

        this._addListeners();
    }

    update(dt) {
        if (this._isActive()) {
            this._updateHook(dt);

            this._updateScrollVariable(dt);

            this._updateImportExportLabel(dt);
        }
    }

    // Hooks

    _setEasyTuneVariableHook() {
    }

    _refreshUIHook() {
    }

    _startHook(parentObject, params) {
    }

    _addListenersHook() {
    }

    _updateHook(dt) {
    }

    // Hooks end

    _refreshUI() {
        if (this._myVariable) {
            if (this._myVariable.myName != null) {
                this._myUI.myVariableLabelTextComponent.text = this._myVariable.myName.concat(this._myAppendToVariableName);
            } else {
                let name = "Unknown";
                this._myUI.myVariableLabelTextComponent.text = name.concat(this._myAppendToVariableName);
            }

            this._refreshUIHook();
        }
    }

    _updateScrollVariable(dt) {
        if (this._myScrollVariableActive) {
            if (this._myScrollVariableTimer <= 0) {
                this._scrollVariableRequest(this._myScrollDirection);
                this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
                this._myHasScrolled = true;
            } else {
                this._myScrollVariableTimer -= dt;
            }
        }
    }

    _updateImportExportLabel(dt) {
        if (this._myResetImportLabelTimer.isRunning(dt)) {
            this._myResetImportLabelTimer.update(dt);
            if (this._myResetImportLabelTimer.isDone()) {
                this._myResetImportLabelTimer.reset();
                this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportButtonText;
            }
        }

        if (this._myResetExportLabelTimer.isRunning(dt)) {
            this._myResetExportLabelTimer.update(dt);
            if (this._myResetExportLabelTimer.isDone()) {
                this._myResetExportLabelTimer.reset();
                this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportButtonText;
            }
        }
    }

    _isActive() {
        return this._myIsVisible && this._myVariable;
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myNextButtonCursorTargetComponent.onDown.add(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.onDownOnHover.add(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.onUp.add(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myNextButtonCursorTargetComponent.onUpWithNoDown.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.onUnhover.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myNextButtonBackgroundComponent.material));
        ui.myNextButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myNextButtonBackgroundComponent.material));

        ui.myPreviousButtonCursorTargetComponent.onDown.add(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.onDownOnHover.add(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.onUp.add(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myPreviousButtonCursorTargetComponent.onUpWithNoDown.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.onUnhover.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));
        ui.myPreviousButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));

        ui.myImportButtonCursorTargetComponent.onUp.add(this._importVariables.bind(this));
        ui.myImportButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myImportButtonBackgroundComponent.material));
        ui.myImportButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myImportButtonBackgroundComponent.material));

        ui.myExportButtonCursorTargetComponent.onUp.add(this._exportVariables.bind(this));
        ui.myExportButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myExportButtonBackgroundComponent.material));
        ui.myExportButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myExportButtonBackgroundComponent.material));

        this._addListenersHook();
    }

    _setScrollVariableActive(active, scrollDirection, skipForceScroll) {
        if (this._isActive() || !active) {
            let forceScroll = !active && !this._myHasScrolled && !skipForceScroll;
            let oldScrollDirection = this._myScrollDirection;

            this.setScrollVariableActive(active, scrollDirection);

            if (forceScroll) {
                this._scrollVariableRequest(oldScrollDirection);
            }
        }
    }

    _scrollVariableRequest(amount) {
        if (this._isActive() && amount != 0) {
            for (let callback of this._myScrollVariableRequestCallbacks.values()) {
                callback(amount);
            }
        }
    }

    _genericHover(material) {
        material.color = this._myConfig.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._myConfig.myBackgroundColor;
    }

    _importVariables() {
        if (this._myUI.myImportButtonTextComponent.text == this._myConfig.myImportButtonText) {
            this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportingButtonText;
            this._myResetImportLabelTimer.reset();

            this._myParams.myVariablesImportCallback();
        }
    }

    _exportVariables() {
        if (this._myUI.myExportButtonTextComponent.text == this._myConfig.myExportButtonText) {
            this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportingButtonText;
            this._myResetExportLabelTimer.reset();

            this._myParams.myVariablesExportCallback();
        }
    }
}