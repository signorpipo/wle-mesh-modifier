import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals";
import { EasyTuneUtils } from "../../easy_tune_utils";

export class EasySetTuneTargetChildNumberComponent extends Component {
    static TypeName = "pp-easy-set-tune-target-child-number";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsDefault: Property.bool(false),
    };

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyTuneVariableName = "Target Child ";

            if (this._myVariableName == "") {
                this._myEasyTuneVariableName = this._myEasyTuneVariableName.concat(this.object.pp_getID());
            } else {
                this._myEasyTuneVariableName = this._myEasyTuneVariableName.concat(this._myVariableName);
            }

            let childrenCount = this.object.pp_getChildren().length;
            let min = 1;
            let max = childrenCount;
            if (childrenCount == 0) {
                min = 0;
                max = 0;
            }

            Globals.getEasyTuneVariables(this.engine).add(new EasyTuneInt(this._myEasyTuneVariableName, 0, 10, min, max));
            if (this._mySetAsDefault) {
                EasyTuneUtils.setWidgetActiveVariable(this._myEasyTuneVariableName, this.engine);
            }

            this._myCurrentChildIndex = -1;
            this._myCurrentChildrenCount = childrenCount;

            this._myEasyTuneTarget = null;
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (Globals.getEasyTuneVariables(this.engine).isActive(this._myEasyTuneVariableName)) {
                let childrenCount = this.object.pp_getChildren().length;
                if (childrenCount != this._myCurrentChildrenCount) {
                    this._myCurrentChildrenCount = childrenCount;

                    let min = 1;
                    let max = childrenCount;
                    if (childrenCount == 0) {
                        min = 0;
                        max = 0;
                    }

                    let easyTuneVariable = Globals.getEasyTuneVariables(this.engine).getEasyTuneVariable(this._myEasyTuneVariableName);
                    easyTuneVariable.setMin(min);
                    easyTuneVariable.setMax(max);
                }

                let childIndex = Globals.getEasyTuneVariables(this.engine).get(this._myEasyTuneVariableName);
                if (childIndex != this._myCurrentChildIndex) {
                    if (childIndex == 0 && this._myCurrentChildIndex != -1) {
                        if (Globals.getEasyTuneTarget(this.engine) == this._myEasyTuneTarget) {
                            Globals.removeEasyTuneTarget(this.engine);
                        }
                        this._myEasyTuneTarget = null;
                    } else if (childIndex > 0) {
                        this._myEasyTuneTarget = this.object.pp_getChildren()[childIndex - 1];
                        Globals.setEasyTuneTarget(this._myEasyTuneTarget, this.engine);
                    }

                    this._myCurrentChildIndex = childIndex;
                }
            }
        }
    }
}