import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils } from "../../../../cauldron/utils/clone_utils";
import { isToolEnabled } from "../../../cauldron/tool_globals";
import { EasyTransform } from "../easy_transform";

export class EasyTransformComponent extends Component {
    static TypeName = "pp-easy-transform";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsDefault: Property.bool(false),
        _myUseTuneTarget: Property.bool(false),
        _myIsLocal: Property.bool(false),
        _myScaleAsOne: Property.bool(true) // Edit all scale values together
    };

    init() {
        this._myEasyObjectTuner = null;

        if (isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyTransform(this._myIsLocal, this._myScaleAsOne, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
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