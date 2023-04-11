import { Component, Property } from "@wonderlandengine/api";
import { getPlayerObjects } from "../../../pp/scene_objects_global";
import { InputUtils } from "../../cauldron/input_utils";

export class CopyHandTransformComponent extends Component {
    static TypeName = "pp-copy-hand-transform";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left")
    };

    init() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
    }

    update(dt) {
        let hand = getPlayerObjects(this.engine).myHands[this._myHandednessType];
        this.object.pp_setTransformQuat(hand.pp_getTransformQuat());
        this.object.pp_setScale(hand.pp_getScale());
    }
}