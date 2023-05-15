import { Component, Emitter, PhysXComponent, Property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../cauldron/wl/utils/component_utils";
import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { Globals } from "../../pp/globals";

export class GrabbableComponent extends Component {
    static TypeName = "pp-grabbable";
    static Properties = {
        _myThrowLinearVelocityMultiplier: Property.float(1),
        _myThrowAngularVelocityMultiplier: Property.float(1),
        _myKinematicValueOnRelease: Property.enum(["True", "False", "Own"], "False"),
        _myParentOnRelease: Property.enum(["Scene", "Own"], "Own")
    };

    init() {
        this._myGrabbed = false;

        this._myGrabber = null;

        this._myOldParent = null;
        this._myPhysX = null;
        this._myOldKinematicValue = null;

        this._myGrabEmitter = new Emitter();      // Signature: listener(grabber, grabbable)
        this._myThrowEmitter = new Emitter();     // Signature: listener(grabber, grabbable)
        this._myReleaseEmitter = new Emitter();   // Signature: listener(grabber, grabbable, isThrow)
    }

    start() {
        this._myOldParent = this.object.pp_getParent();
        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
    }

    onDeactivate() {
        this.release();
    }

    grab(grabber) {
        if (!this.isGrabbed()) {
            this._myOldKinematicValue = this._myPhysX.kinematic;
        }

        this.release();

        this._myPhysX.kinematic = true;

        this._myOldParent = this.object.pp_getParent();
        this.object.pp_setParent(grabber);

        this._myGrabbed = true;

        this._myGrabEmitter.notify(grabber, this);
    }

    throw(linearVelocity, angularVelocity) {
        if (this._myGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            // #TODO For now kinematic is not updated instantly, add the if as soon as it is
            //if (!this._myPhysX.kinematic) {
            this._myPhysX.linearVelocity = linearVelocity.vec3_scale(this._myThrowLinearVelocityMultiplier);
            this._myPhysX.angularVelocity = angularVelocity.vec3_scale(this._myThrowAngularVelocityMultiplier);
            //}

            this._myThrowEmitter.notify(grabber, this);
            this._myReleaseEmitter.notify(grabber, this, true);
        }
    }

    release() {
        if (this._myGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            this._myReleaseEmitter.notify(grabber, this, false);
        }
    }

    getLinearVelocity() {
        let linearVelocity = vec3_create();

        this._myPhysX.linearVelocity.vec3_clone(linearVelocity);

        return linearVelocity;
    }

    getAngularVelocity() {
        return this.getAngularVelocityDegrees();
    }

    getAngularVelocityDegrees() {
        let angularVelocityDegrees = vec3_create();

        this._myPhysX.angularVelocity.vec3_toDegrees(angularVelocityDegrees);

        return angularVelocityDegrees;
    }

    getAngularVelocityRadians() {
        let angularVelocityRadians = vec3_create();

        this._myPhysX.angularVelocity.vec3_clone(angularVelocityRadians);

        return angularVelocityRadians;
    }

    isGrabbed() {
        return this._myGrabbed;
    }

    getGrabber() {
        return this._myGrabber;
    }

    registerGrabEventListener(id, listener) {
        this._myGrabEmitter.add(listener, { id: id });
    }

    unregisterGrabEventListener(id) {
        this._myGrabEmitter.remove(id);
    }

    registerThrowEventListener(id, listener) {
        this._myThrowEmitter.add(listener, { id: id });
    }

    unregisterThrowEventListener(id) {
        this._myThrowEmitter.remove(id);
    }

    registerReleaseEventListener(id, listener) {
        this._myReleaseEmitter.add(listener, { id: id });
    }

    unregisterReleaseEventListener(id) {
        this._myReleaseEmitter.remove(id);
    }

    _release() {
        if (this._myParentOnRelease == 0) {
            this.object.pp_setParent(Globals.getSceneObjects(this.engine).myDynamics);
        } else {
            this.object.pp_setParent(this._myOldParent);
        }

        this._myGrabbed = false;
        this._myGrabber = null;

        if (this._myKinematicValueOnRelease == 0) {
            this._myPhysX.kinematic = true;
        } else if (this._myKinematicValueOnRelease == 1) {
            this._myPhysX.kinematic = false;
        } else if (this._myOldKinematicValue != null) {
            this._myPhysX.kinematic = this._myOldKinematicValue;
        }

        if (this._myPhysX.kinematic) {
            this._myPhysX.linearVelocity = vec3_create();
            this._myPhysX.angularVelocity = vec3_create();
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = ComponentUtils.cloneDefault(this, targetObject);

        return clonedComponent;
    }

    pp_clonePostProcess(clonedComponent) {
        clonedComponent.start();
    }
}