import { MeshComponent } from "@wonderlandengine/api";
import { Timer } from "../../../../../../cauldron/cauldron/timer";
import { FSM } from "../../../../../../cauldron/fsm/fsm";
import { TimerState } from "../../../../../../cauldron/fsm/states/timer_state";
import { vec4_create } from "../../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../../pp/globals";
import { NumberOverValue } from "../../../../../cauldron/cauldron/number_over_value";
import { PlayerLocomotionTeleportState } from "./player_locomotion_teleport_state";

export class PlayerLocomotionTeleportTeleportBlinkState extends PlayerLocomotionTeleportState {

    constructor(teleportParams, teleportRuntimeParams, locomotionRuntimeParams) {
        super(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);

        this._myBlinkSphere = Globals.getPlayerObjects(this._myTeleportParams.myEngine).myPlayerCauldron.pp_addObject();
        this._myBlinkSphereMeshComponent = this._myBlinkSphere.pp_addComponent(MeshComponent);
        this._myBlinkSphereMeshComponent.mesh = Globals.getDefaultMeshes(this._myTeleportParams.myEngine).myInvertedSphere;
        this._myBlinkSphereMeshComponent.material = Globals.getDefaultMaterials(this._myTeleportParams.myEngine).myFlatTransparentNoDepth.clone();
        this._myBlinkSphereMaterialColor = vec4_create(
            this._myTeleportParams.myTeleportParams.myBlinkSphereColor[0] / 255,
            this._myTeleportParams.myTeleportParams.myBlinkSphereColor[1] / 255,
            this._myTeleportParams.myTeleportParams.myBlinkSphereColor[2] / 255,
            0);

        this._myBlinkSphereMeshComponent.material.color = this._myBlinkSphereMaterialColor;

        this._myBlinkSphere.pp_resetTransformLocal();
        this._myBlinkSphere.pp_setScaleLocal(this._myTeleportParams.myTeleportParams.myBlinkSphereScale);
        this._myBlinkSphere.pp_setActive(false);

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "Locomotion Teleport Teleport Blink");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");

        this._myFSM.addState("fade_out", this._fadeOutUpdate.bind(this));
        this._myFSM.addState("wait", new TimerState(this._myTeleportParams.myTeleportParams.myBlinkWaitSeconds, "done"));
        this._myFSM.addState("fade_in", this._fadeInUpdate.bind(this));

        this._myFSM.addTransition("init", "idle", "start");

        this._myFSM.addTransition("idle", "fade_out", "teleport", this._startFadeOut.bind(this));
        this._myFSM.addTransition("fade_out", "wait", "done", this._teleport.bind(this));
        this._myFSM.addTransition("wait", "fade_in", "done", this._startFadeIn.bind(this));
        this._myFSM.addTransition("fade_in", "idle", "done", this._teleportDone.bind(this));

        this._myFSM.addTransition("idle", "idle", "stop");
        this._myFSM.addTransition("fade_out", "idle", "stop", this._stop.bind(this, true));
        this._myFSM.addTransition("wait", "idle", "stop", this._stop.bind(this, false));
        this._myFSM.addTransition("fade_in", "idle", "stop", this._stop.bind(this, false));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myFadeInTimer = new Timer(this._myTeleportParams.myTeleportParams.myBlinkFadeInSeconds);
        this._myFadeOutTimer = new Timer(this._myTeleportParams.myTeleportParams.myBlinkFadeOutSeconds);
        this._myFadeOutAlphaOverTime = new NumberOverValue(0, 1, 0, 1);
        this._myFadeInAlphaOverTime = new NumberOverValue(1, 0, 0, 1);
    }

    start(fsm) {
        this._myParentFSM = fsm;

        this._myFSM.perform("teleport");
    }

    end() {
        this._myBlinkSphere.pp_setActive(false);
        this._myBlinkSphere.pp_setParent(Globals.getPlayerObjects(this._myTeleportParams.myEngine).myPlayerCauldron, false);
        this._myFSM.perform("stop");
    }

    update(dt, fsm) {
        this._myBlinkSphere.pp_setParent(this._myTeleportParams.myPlayerHeadManager.getHead(), false);
        this._myBlinkSphere.pp_resetTransformLocal();

        this._myFSM.update(dt);
    }

    _startFadeOut() {
        this._myFadeOutTimer.start();
        this._myBlinkSphereMaterialColor[3] = 0;
        this._myBlinkSphereMeshComponent.material.color = this._myBlinkSphereMaterialColor;
        this._myBlinkSphere.pp_setActive(true);

        //this._myLocomotionRuntimeParams.myIsTeleporting = true;
    }

    _startFadeIn() {
        this._myFadeInTimer.start();
    }

    _fadeOutUpdate(dt, fsm) {
        this._myFadeOutTimer.update(dt);

        let alpha = this._myFadeOutAlphaOverTime.get(this._myFadeOutTimer.getPercentage());
        this._myBlinkSphereMaterialColor[3] = alpha;
        this._myBlinkSphereMeshComponent.material.color = this._myBlinkSphereMaterialColor;

        if (this._myFadeOutTimer.isDone()) {
            fsm.perform("done");
        }
    }

    _fadeInUpdate(dt, fsm) {
        this._myFadeInTimer.update(dt);

        let alpha = this._myFadeInAlphaOverTime.get(this._myFadeInTimer.getPercentage());
        this._myBlinkSphereMaterialColor[3] = alpha;
        this._myBlinkSphereMeshComponent.material.color = this._myBlinkSphereMaterialColor;

        if (this._myFadeInTimer.isDone()) {
            fsm.perform("done");
        }
    }

    _teleportDone() {
        this._myBlinkSphere.pp_setActive(false);

        this._myParentFSM.performDelayed("done");
    }

    _stop(teleport) {
        this._myBlinkSphere.pp_setActive(false);

        if (teleport) {
            this._teleport();
        }
    }

    _teleport() {
        //this._myLocomotionRuntimeParams.myIsTeleporting = false;
        this._myLocomotionRuntimeParams.myTeleportJustPerformed = true;
        this._teleportToPosition(this._myTeleportRuntimeParams.myTeleportPosition, this._myTeleportRuntimeParams.myTeleportRotationOnUp, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
    }
}