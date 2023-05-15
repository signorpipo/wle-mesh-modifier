import { Component, Property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils";
import { Globals } from "../../../../pp/globals";
import { EasyMeshColor } from "../easy_mesh_color";

export class EasyMeshColorComponent extends Component {
    static TypeName = "pp-easy-mesh-color";
    static Properties = {
        _myVariableName: Property.string(""),
        _myUseTuneTarget: Property.bool(false),
        _mySetAsDefault: Property.bool(false),
        _myColorModel: Property.enum(["RGB", "HSV"], "HSV"),
        _myColorType: Property.enum(["Color", "Diffuse Color", "Ambient Color", "Specular Color", "Emissive Color", "Fog Color", "Ambient Factor"], "Color"),
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyMeshColor(this._myColorModel, this._myColorType, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
        }
    }

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.start();
            }
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            }
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = ComponentUtils.cloneDefault(this, targetObject);

        return clonedComponent;
    }
}