import { Component, Property } from "@wonderlandengine/api";
import { ObjectUtils } from "../../../cauldron/wl/utils/object_utils";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { InputUtils } from "../input_utils";

export class TrackedHandDrawSkinComponent extends Component {
    static TypeName = "pp-tracked-hand-draw-skin";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myHandSkin: Property.skin(null)
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._prepareJoints();
    }

    update(dt) {
        // Implemented outside class definition
    }

    _prepareJoints() {
        this._myJoints = [];

        let skinJointIDs = this._myHandSkin.jointIds;

        for (let i = 0; i < skinJointIDs.length; i++) {
            this._myJoints[i] = ObjectUtils.wrapObject(skinJointIDs[i]);
        }
    }
}



// IMPLEMENTATION

TrackedHandDrawSkinComponent.prototype.update = function () {
    let transformQuat = quat2_create()
    return function update(dt) {
        for (let i = 0; i < this._myJoints.length; i++) {
            let jointObject = this._myJoints[i];

            let jointID = jointObject.pp_getName(); // Joint name must match the TrackedHandJointID enum value
            let jointPose = Globals.getTrackedHandPose(this._myHandednessType).getJointPose(jointID);

            jointObject.pp_setTransformLocalQuat(jointPose.getTransformQuat(transformQuat, null));
        }
    };
}();