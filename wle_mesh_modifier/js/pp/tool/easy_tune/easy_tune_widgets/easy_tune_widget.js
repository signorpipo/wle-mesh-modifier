PP.EasyTuneWidget = class EasyTuneWidget {

    constructor() {
        this._myIsStarted = false;
        this._myStartVariable = null;

        this._myWidgetFrame = new PP.WidgetFrame("E", 1);
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));

        this._mySetup = new PP.EasyTuneWidgetSetup();
        this._myAdditionalSetup = null;

        this._myWidgets = [];

        this._myEasyTuneVariables = null;
        this._myEasyTuneLastSize = 0;
        this._myVariableNames = null;

        this._myCurrentWidget = null;
        this._myCurrentVariable = null;

        this._myScrollVariableTimer = 0;

        this._myGamepad = null;

        this._myRefreshVariablesTimer = 0;

        this._myDirty = false;
    }

    setActiveVariable(variableName) {
        if (!this._myIsStarted) {
            this._myStartVariable = variableName;
        } else if (this._myEasyTuneVariables.has(variableName)) {
            this._myCurrentVariable = this._myEasyTuneVariables.get(variableName);
            this._selectCurrentWidget();
        } else {
            console.log("Can't set easy tune active variable");
        }
    }

    refresh() {
        if (this._myWidgetFrame.myIsWidgetVisible) {
            this._myDirty = true;
        }
    }

    setVisible(visible) {
        this._myWidgetFrame.setVisible(visible);
    }

    isVisible() {
        return this._myWidgetFrame.isVisible();
    }

    start(parentObject, additionalSetup, easyTuneVariables) {
        this._myRightGamepad = PP.myRightGamepad; //@EDIT get right gamepad here based on how you store it in your game
        this._myLeftGamepad = PP.myLeftGamepad; //@EDIT get left gamepad here based on how you store it in your game
        if (this._mySetup.myGamepadHandedness == PP.ToolHandedness.RIGHT) {
            this._myGamepad = this._myRightGamepad;
        } else if (this._mySetup.myGamepadHandedness == PP.ToolHandedness.LEFT) {
            this._myGamepad = this._myLeftGamepad;
        }

        this._myIsStarted = true;

        this._myAdditionalSetup = additionalSetup;

        this._myWidgetFrame.start(parentObject, additionalSetup);

        this._myEasyTuneVariables = easyTuneVariables;
        this._myEasyTuneLastSize = this._myEasyTuneVariables.size;
        this._myVariableNames = Array.from(this._myEasyTuneVariables.keys());

        if (this._myEasyTuneVariables.size > 0) {
            this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[0]);
        }

        if (this._myStartVariable) {
            if (this._myEasyTuneVariables.has(this._myStartVariable)) {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myStartVariable);
            } else {
                console.log("Can't set easy tune active variable");
            }
        }

        this._initializeWidgets();
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        if (this._myEasyTuneVariables.size != this._myEasyTuneLastSize || this._myDirty) {
            this._refreshEasyTuneVariables();
        }

        if (this._myWidgetFrame.myIsWidgetVisible && this._myEasyTuneVariables.size > 0) {
            if (this._mySetup.myRefreshVariablesDelay != null) {
                this._myRefreshVariablesTimer += dt;
                if (this._myRefreshVariablesTimer > this._mySetup.myRefreshVariablesDelay) {
                    this._myRefreshVariablesTimer = 0;
                    this._refreshEasyTuneVariables();
                }
            }

            if (this._myCurrentWidget) {
                this._myCurrentWidget.update(dt);
            }

            if (this._myAdditionalSetup.myEnableGamepadScrollVariable) {
                this._updateGamepadScrollVariable(dt);
            }
        }

        this._updateGamepadWidgetVisibility();

        this._updateActiveVariable();
    }

    _initializeWidgets() {
        this._myWidgets[PP.EasyTuneVariableType.NONE] = new PP.EasyTuneNoneWidget();
        this._myWidgets[PP.EasyTuneVariableType.NUMBER] = new PP.EasyTuneNumberWidget(this._myGamepad);
        this._myWidgets[PP.EasyTuneVariableType.BOOL] = new PP.EasyTuneBoolWidget(this._myGamepad);
        this._myWidgets[PP.EasyTuneVariableType.TRANSFORM] = new PP.EasyTuneTransformWidget(this._myGamepad);

        for (let item of this._myWidgets) {
            item.start(this._myWidgetFrame.getWidgetObject(), this._myAdditionalSetup);
            item.setVisible(false);
            item.registerScrollVariableRequestEventListener(this, this._scrollVariable.bind(this));
        }

        this._selectCurrentWidget();
    }

    _selectCurrentWidget() {
        if (this._myEasyTuneVariables.size <= 0) {
            return;
        }

        let scrollVariableActive = false;
        let scrollVariableDirection = 0;

        if (this._myCurrentWidget) {
            scrollVariableActive = this._myCurrentWidget.isScrollVariableActive();
            scrollVariableDirection = this._myCurrentWidget.getScrollVariableDirection();

            this._myCurrentWidget.setVisible(false);
        }

        if (this._myCurrentVariable.myType in this._myWidgets) {
            this._myCurrentWidget = this._myWidgets[this._myCurrentVariable.myType];
        } else {
            this._myCurrentWidget = this._myWidgets[PP.EasyTuneVariableType.NONE];
        }

        this._myCurrentWidget.setEasyTuneVariable(this._myCurrentVariable, this._createIndexString());
        this._myCurrentWidget.setVisible(this._myWidgetFrame.myIsWidgetVisible);
        this._myCurrentWidget.setScrollVariableActive(scrollVariableActive, scrollVariableDirection);
    }

    _refreshEasyTuneVariables() {
        this._myVariableNames = Array.from(this._myEasyTuneVariables.keys());
        this._myEasyTuneLastSize = this._myEasyTuneVariables.size;

        if (this._myEasyTuneVariables.size > 0) {
            if (this._myCurrentVariable && this._myEasyTuneVariables.has(this._myCurrentVariable.myName)) {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myCurrentVariable.myName);
            } else {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[0]);
            }

            this._selectCurrentWidget();
        } else {
            this._myCurrentVariable = null;
            if (this._myCurrentWidget) {
                this._myCurrentWidget.setVisible(false);
                this._myCurrentWidget = null;
            }
        }

        this._myDirty = false;
    }

    _updateGamepadWidgetVisibility() {
        if (this._myGamepad) {
            if ((this._myGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) ||
                (this._myGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed)) {
                this._toggleVisibility();
            }
        }
    }

    _toggleVisibility() {
        this._myWidgetFrame.toggleVisibility();
    }

    _widgetVisibleChanged(visible) {
        for (let widget of this._myWidgets) {
            widget.setVisible(false);
        }

        if (this._myCurrentWidget) {
            if (this._myEasyTuneVariables.size > 0) {
                this._myCurrentWidget.setVisible(visible);
            } else {
                this._myCurrentWidget.setVisible(false);
            }
        }

        if (visible) {
            this._refreshEasyTuneVariables();
        }
    }

    _updateGamepadScrollVariable(dt) {
        if (this._myGamepad && (!this._mySetup.myScrollVariableButtonType || this._myGamepad.getButtonInfo(this._mySetup.myScrollVariableButtonType).myIsPressed)) {
            let x = this._myGamepad.getAxesInfo().myAxes[0];
            let y = this._myGamepad.getAxesInfo().myAxes[1];
            if (Math.abs(x) > this._mySetup.myScrollVariableMinXThreshold && Math.abs(y) < this._mySetup.myScrollVariableMaxYThreshold) {
                this._myScrollVariableTimer += dt;
                while (this._myScrollVariableTimer > this._mySetup.myScrollVariableDelay) {
                    this._myScrollVariableTimer -= this._mySetup.myScrollVariableDelay;
                    this._scrollVariable(Math.sign(x));
                }
            } else {
                this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
            }
        } else {
            this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
        }
    }

    _scrollVariable(amount) {
        if (this._myEasyTuneVariables.size <= 0) {
            return;
        }

        let variableIndex = this._getVariableIndex(this._myCurrentVariable);
        if (variableIndex >= 0) {
            let newIndex = (((variableIndex + amount) % this._myVariableNames.length) + this._myVariableNames.length) % this._myVariableNames.length; //manage negative numbers
            if (this._myEasyTuneVariables.has(this._myVariableNames[newIndex])) {
                this._myCurrentVariable = this._myEasyTuneVariables.get(this._myVariableNames[newIndex]);
                this._selectCurrentWidget();
            } else {
                this._refreshEasyTuneVariables();
            }
        } else {
            this._refreshEasyTuneVariables();
        }
    }

    _createIndexString() {
        let indexString = " (";
        let index = (this._getVariableIndex(this._myCurrentVariable) + 1).toString();
        let length = (this._myEasyTuneVariables.size).toString();
        while (index.length < length.length) {
            index = "0".concat(index);
        }

        indexString = indexString.concat(index).concat(" - ").concat(length).concat(")");

        return indexString;
    }

    _getVariableIndex(variable) {
        let variableIndex = this._myVariableNames.indexOf(variable.myName);
        return variableIndex;
    }

    _updateActiveVariable() {
        this._myEasyTuneVariables.forEach(function (value) {
            value.myIsActive = false;
        });

        if (this._myWidgetFrame.myIsWidgetVisible && this._myCurrentVariable) {
            this._myCurrentVariable.myIsActive = true;
        }
    }
};