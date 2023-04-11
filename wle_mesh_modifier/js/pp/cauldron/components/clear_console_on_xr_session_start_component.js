import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../utils/xr_utils";

export class ClearConsoleOnXRSessionStartComponent extends Component {
    static TypeName = "pp-clear-console-on-xr-session-start";
    static Properties = {
        _myFirstTimeOnly: Property.bool(true)
    };

    start() {
        this._myFirstTime = true;
        XRUtils.registerSessionStartEventListener(this, this._onXRSessionStart.bind(this), this.engine);
    }

    _onXRSessionStart() {
        if (!this._myFirstTimeOnly || this._myFirstTime) {
            this._myFirstTime = false;
            console.clear();
        }
    }
}