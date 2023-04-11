import { getMainEngine } from "../../../../cauldron/wl/engine_globals";
import { GamepadAxesID } from "../../../../input/gamepad/gamepad_buttons";
import { EasyTuneBaseWidget } from "../base/easy_tune_base_widget";
import { EasyTuneBoolArrayWidgetConfig } from "./easy_tune_bool_array_widget_config";
import { EasyTuneBoolArrayWidgetUI } from "./easy_tune_bool_array_widget_ui";

export class EasyTuneBoolArrayWidget extends EasyTuneBaseWidget {

    constructor(params, arraySize, gamepad, engine = getMainEngine()) {
        super(params);

        this._myConfig = new EasyTuneBoolArrayWidgetConfig(arraySize);
        this._myUI = new EasyTuneBoolArrayWidgetUI(engine);

        this._myGamepad = gamepad;

        this._myValueEditIndex = 0;
        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myValueEditActive = false;
    }

    _refreshUIHook() {
        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this._myUI.myValueTextComponents[i].text = (this._myVariable.myValue[i]) ? "true" : "false";
        }
    }

    _startHook(parentObject, params) {
        this._myUI.setAdditionalButtonsActive(params.myAdditionalButtonsEnabled);
    }

    _updateHook(dt) {
        this._updateValue(dt);
    }

    _updateValue(dt) {
        let stickVariableIntensity = 0;

        if (this._myGamepad) {
            stickVariableIntensity = this._myGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes[1];
        }

        let valueIntensity = 0;
        if (this._myValueEditActive) {
            valueIntensity = stickVariableIntensity;
        } else if (this._myValueButtonEditIntensity != 0) {
            if (this._myValueButtonEditIntensityTimer <= 0) {
                valueIntensity = this._myValueButtonEditIntensity;
            } else {
                this._myValueButtonEditIntensityTimer -= dt;
            }
        }

        if (Math.abs(valueIntensity) > this._myConfig.myThumbstickToggleThreshold) {
            this._myVariable.myValue[this._myValueEditIndex] = valueIntensity > 0;
            this._refreshUI();
        }
    }

    _addListenersHook() {
        let ui = this._myUI;

        ui.myVariableLabelCursorTargetComponent.onClick.add(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.onUnhover.add(this._genericTextUnHover.bind(this, ui.myVariableLabelText, this._myConfig.myVariableLabelTextScale));

        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUpWithNoDown.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUpWithNoDown.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));

            ui.myValueIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));

            ui.myValueCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, i));
            ui.myValueCursorTargetComponents[i].onHover.add(this._setValueEditActive.bind(this, i, ui.myValueTexts[i], true));
            ui.myValueCursorTargetComponents[i].onUnhover.add(this._setValueEditActive.bind(this, i, ui.myValueTexts[i], false));
        }
    }

    _setValueEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
                this._myValueEditIndex = index;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setValueEditActive(index, text, active) {
        if (this._isActive() || !active) {
            if (active) {
                this._myValueEditIndex = index;
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleWorld(this._myConfig.myValueTextScale);
            }

            this._myValueEditActive = active;
        }
    }

    _resetValue(index) {
        if (this._isActive()) {
            this._myVariable.myValue[index] = this._myVariable.myDefaultValue[index];
            this._myUI.myValueTextComponents[index].text = (this._myVariable.myValue[index]) ? "true" : "false";
        }
    }

    _resetAllValues() {
        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this._resetValue(i);
        }
    }

    _genericTextHover(text) {
        text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
    }

    _genericTextUnHover(text, originalScale) {
        text.pp_setScaleWorld(originalScale);
    }
}