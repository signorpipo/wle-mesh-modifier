import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils } from "../../../../cauldron/utils/clone_utils";
import { isToolEnabled } from "../../../cauldron/tool_globals";
import { EasyMeshAmbientFactor } from "../easy_mesh_ambient_factor";

export class EasyMeshAmbientFactorComponent extends Component {
    static TypeName = "pp-easy-mesh-ambient-factor";
    static Properties = {
        _myVariableName: Property.string(""),
        _myUseTuneTarget: Property.bool(false),
        _mySetAsDefault: Property.bool(false)
    };

    init() {
        this._myEasyObjectTuner = null;

        if (isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyMeshAmbientFactor(this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
        }
    }

    start() {
        if (isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.start();
            }
        }
    }

    update(dt) {
        if (isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            }
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}