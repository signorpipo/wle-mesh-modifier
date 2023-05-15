import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";
import { ConsoleVR } from "../console_vr";

export class InitConsoleVRComponent extends Component {
    static TypeName = "pp-init-console-vr";
    static Properties = {
        _myInit: Property.bool(true)
    };

    init() {
        this._myConsoleVR = null;

        if (this._myInit) {
            // Prevents double global from same engine
            if (!Globals.hasConsoleVR(this.engine)) {
                this._myConsoleVR = new ConsoleVR();

                Globals.setConsoleVR(this._myConsoleVR, this.engine);
            }
        }
    }

    onDestroy() {
        if (this._myConsoleVR != null && Globals.getConsoleVR(this.engine) == this._myConsoleVR) {
            Globals.removeConsoleVR(this.engine);
        }
    }
}