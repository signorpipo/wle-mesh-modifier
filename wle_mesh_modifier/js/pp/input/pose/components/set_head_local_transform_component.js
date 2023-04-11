import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { quat2_create, quat_create, vec3_create } from "../../../plugin/js/extensions/array_extension";
import { BasePoseParams } from "../base_pose";
import { HeadPose } from "../head_pose";

export class SetHeadLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-local-transform";
    static Properties = {
        _myCameraNonXR: Property.object(),
        _myFixForward: Property.bool(true),
        _myUpdateOnViewReset: Property.bool(true)
    };

    init() {
        this._myHeadPose = new HeadPose(new BasePoseParams(this.engine));
        this._myHeadPose.setFixForward(this._myFixForward);
        this._myHeadPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myHeadPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    start() {
        this._myHeadPose.start();
        this.update(0);
    }

    update(dt) {
        // Implemented outside class definition
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

SetHeadLocalTransformComponent.prototype.update = function () {
    let cameraNonXRRotation = quat_create();
    let cameraNonXRUp = vec3_create();
    let cameraNonXRPosition = vec3_create();
    return function update(dt) {
        if (XRUtils.isSessionActive(this.engine)) {
            this._myHeadPose.update(dt);
        } else if (!XRUtils.isSessionActive(this.engine)) {
            cameraNonXRRotation = this._myCameraNonXR.pp_getRotationLocalQuat(cameraNonXRRotation);
            if (this._myFixForward) {
                cameraNonXRRotation.quat_rotateAxisRadians(Math.PI, cameraNonXRRotation.quat_getUp(cameraNonXRUp), cameraNonXRRotation);
            }
            this.object.pp_setPositionLocal(this._myCameraNonXR.pp_getPositionLocal(cameraNonXRPosition));
            this.object.pp_setRotationLocalQuat(cameraNonXRRotation);
        }
    };
}();

SetHeadLocalTransformComponent.prototype.onPoseUpdated = function () {
    let headPoseTransform = quat2_create();
    return function onPoseUpdated() {
        if (XRUtils.isSessionActive(this.engine)) {
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
        }
    }
}();