import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { ToolHandedness } from "../cauldron/tool_types";
import { WidgetFrameConfig } from "./widget_frame_config";
import { WidgetFrameUI } from "./widget_frame_ui";

export class WidgetParams {

    constructor() {
        this.myHandedness = ToolHandedness.NONE;

        this.myPlaneMaterial = null;
        this.myTextMaterial = null;
    }
}

export class WidgetFrame {

    constructor(widgetLetterID, buttonsColumnIndex, engine = getMainEngine()) {
        this.myIsWidgetVisible = true;
        this.myIsPinned = false;

        this._myConfig = new WidgetFrameConfig(widgetLetterID, buttonsColumnIndex);
        this._myParams = null;

        this._myUI = new WidgetFrameUI(engine);
        this._myShowVisibilityButton = false;

        this._myWidgetVisibleChangedCallbacks = new Map();      // Signature: callback(isWidgetVisible)
        this._myPinChangedCallbacks = new Map();                // Signature: callback(isPinned)
    }

    getWidgetObject() {
        return this._myUI.myWidgetObject;
    }

    setVisible(visible) {
        this.myIsWidgetVisible = !visible;
        this._toggleVisibility(false, true);
    }

    isVisible() {
        return this.myIsWidgetVisible;
    }

    toggleVisibility() {
        this._toggleVisibility(false, true);
    }

    togglePin() {
        this._togglePin(false);
    }

    registerWidgetVisibleChangedEventListener(id, callback) {
        this._myWidgetVisibleChangedCallbacks.set(id, callback);
    }

    unregisterWidgetVisibleChangedEventListener(id) {
        this._myWidgetVisibleChangedCallbacks.delete(id);
    }

    registerPinChangedEventListener(id, callback) {
        this._myPinChangedCallbacks.set(id, callback);
    }

    unregisterPinChangedEventListener(id) {
        this._myPinChangedCallbacks.delete(id);
    }

    start(parentObject, params) {
        this._myParams = params;

        this._myUI.build(parentObject, this._myConfig, params);
        this._myUI.setVisibilityButtonVisible(params.myShowVisibilityButton);
        this._myShowVisibilityButton = params.myShowVisibilityButton;
        if (!params.myShowOnStart) {
            this._toggleVisibility(false, false);
        }

        this._addListeners();
    }

    update(dt) {
        this._myUI.update(dt);
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myPinButtonCursorTargetComponent.onClick.add(this._togglePin.bind(this, true));
        ui.myPinButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPinButtonBackgroundComponent.material));
        ui.myPinButtonCursorTargetComponent.onUnhover.add(this._pinUnHover.bind(this, ui.myPinButtonBackgroundComponent.material));

        ui.myVisibilityButtonCursorTargetComponent.onClick.add(this._toggleVisibility.bind(this, true, true));
        ui.myVisibilityButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
        ui.myVisibilityButtonCursorTargetComponent.onUnhover.add(this._visibilityUnHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
    }

    _toggleVisibility(isButton, notify) {
        this.myIsWidgetVisible = !this.myIsWidgetVisible;

        this._myUI.setWidgetVisible(this.myIsWidgetVisible);

        let textMaterial = this._myUI.myVisibilityButtonTextComponent.material;
        let backgroundMaterial = this._myUI.myVisibilityButtonBackgroundComponent.material;
        if (this.myIsWidgetVisible) {
            textMaterial.color = this._myConfig.myDefaultTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._myConfig.myBackgroundColor;
            }
        } else {
            textMaterial.color = this._myConfig.myButtonDisabledTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._myConfig.myButtonDisabledBackgroundColor;
            }
        }

        if (notify) {
            for (let callback of this._myWidgetVisibleChangedCallbacks.values()) {
                callback(this.myIsWidgetVisible);
            }
        }

        this._myUI.setVisibilityButtonVisible(this._myShowVisibilityButton);
    }

    _togglePin(isButton) {
        if (this.myIsWidgetVisible) {
            this.myIsPinned = !this.myIsPinned;

            this._myUI.setPinned(this.myIsPinned);

            let textMaterial = this._myUI.myPinButtonTextComponent.material;
            let backgroundMaterial = this._myUI.myPinButtonBackgroundComponent.material;
            if (this.myIsPinned) {
                textMaterial.color = this._myConfig.myDefaultTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._myConfig.myBackgroundColor;
                }
            } else {
                textMaterial.color = this._myConfig.myButtonDisabledTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._myConfig.myButtonDisabledBackgroundColor;
                }
            }

            for (let callback of this._myPinChangedCallbacks.values()) {
                callback(this.myIsPinned);
            }
        }
    }

    _genericHover(material) {
        material.color = this._myConfig.myButtonHoverColor;
    }

    _visibilityUnHover(material) {
        if (this.myIsWidgetVisible) {
            material.color = this._myConfig.myBackgroundColor;
        } else {
            material.color = this._myConfig.myButtonDisabledBackgroundColor;
        }
    }

    _pinUnHover(material) {
        if (this.myIsPinned) {
            material.color = this._myConfig.myBackgroundColor;
        } else {
            material.color = this._myConfig.myButtonDisabledBackgroundColor;
        }
    }
}