import { Component, Property } from "@wonderlandengine/api";
import { PhysicsLayerFlags } from "../../../../../cauldron/physics/physics_layer_flags";
import { InputUtils } from "../../../../../input/cauldron/input_utils";
import { CollisionCheck } from "../../../character_controller/collision/legacy/collision_check/collision_check";
import { CleanedPlayerLocomotion } from "./cleaned/player_locomotion_cleaned";
import { PlayerLocomotion, PlayerLocomotionParams } from "./player_locomotion";

let _myCollisionChecks = new WeakMap();

export function getCollisionCheck(engine = getMainEngine()) {
    return _myCollisionChecks.get(engine);
}

export function setCollisionCheck(collisionCheck, engine = getMainEngine()) {
    _myCollisionChecks.set(engine, collisionCheck);
}

export class PlayerLocomotionComponent extends Component {
    static TypeName = "pp-player-locomotion";
    static Properties = {
        _myPhysicsBlockLayerFlags: Property.string("0, 0, 0, 0, 0, 0, 0, 0"),
        _myDefaultHeight: Property.float(1.75),
        _myMaxSpeed: Property.float(2),
        _myMaxRotationSpeed: Property.float(100),
        _myCharacterRadius: Property.float(0.3),
        _myIsSnapTurn: Property.bool(true),
        _mySnapTurnOnlyVR: Property.bool(true),
        _mySnapTurnAngle: Property.float(30),
        _mySnapTurnSpeedDegrees: Property.float(0),
        _myFlyEnabled: Property.bool(false),
        _myStartFlying: Property.bool(false),
        _myMinAngleToFlyUpNonVR: Property.float(30),
        _myMinAngleToFlyDownNonVR: Property.float(50),
        _myMinAngleToFlyUpVR: Property.float(60),
        _myMinAngleToFlyDownVR: Property.float(1),
        _myMinAngleToFlyRight: Property.float(60),
        _myMainHand: Property.enum(["Left", "Right"], "Left"),
        _myVRDirectionReferenceType: Property.enum(["Head", "Hand", "Custom Object"], "Hand"),
        _myVRDirectionReferenceObject: Property.object(),
        _myTeleportParableStartReferenceObject: Property.object(),
        _myTeleportPositionObject: Property.object(),
        _myDebugHorizontalEnabled: Property.bool(false),
        _myDebugVerticalEnabled: Property.bool(false),
        _myUseCleanedVersion: Property.bool(true),
        _myMoveThroughCollisionShortcutEnabled: Property.bool(false),
        _myMoveHeadShortcutEnabled: Property.bool(false)
    };

    start() {
        setCollisionCheck(new CollisionCheck(this.engine), this.engine);

        let params = new PlayerLocomotionParams(this.engine);
        params.myDefaultHeight = this._myDefaultHeight;

        params.myMaxSpeed = this._myMaxSpeed;
        params.myMaxRotationSpeed = this._myMaxRotationSpeed;

        params.myCharacterRadius = this._myCharacterRadius;

        params.myIsSnapTurn = this._myIsSnapTurn;
        params.mySnapTurnOnlyVR = this._mySnapTurnOnlyVR;
        params.mySnapTurnAngle = this._mySnapTurnAngle;
        params.mySnapTurnSpeedDegrees = this._mySnapTurnSpeedDegrees;

        params.myFlyEnabled = this._myFlyEnabled;
        params.myStartFlying = this._myStartFlying;
        params.myMinAngleToFlyUpNonVR = this._myMinAngleToFlyUpNonVR;
        params.myMinAngleToFlyDownNonVR = this._myMinAngleToFlyDownNonVR;
        params.myMinAngleToFlyUpVR = this._myMinAngleToFlyUpVR;
        params.myMinAngleToFlyDownVR = this._myMinAngleToFlyDownVR;
        params.myMinAngleToFlyRight = this._myMinAngleToFlyRight;

        params.myMainHand = InputUtils.getHandednessByIndex(this._myMainHand);

        params.myVRDirectionReferenceType = this._myVRDirectionReferenceType;
        params.myVRDirectionReferenceObject = this._myVRDirectionReferenceObject;

        params.myTeleportParableStartReferenceObject = this._myTeleportParableStartReferenceObject;

        params.myForeheadExtraHeight = 0.1;

        params.myTeleportPositionObject = this._myTeleportPositionObject;

        params.myMoveThroughCollisionShortcutEnabled = this._myMoveThroughCollisionShortcutEnabled;
        params.myMoveHeadShortcutEnabled = this._myMoveHeadShortcutEnabled;

        params.myDebugHorizontalEnabled = this._myDebugHorizontalEnabled;
        params.myDebugVerticalEnabled = this._myDebugVerticalEnabled;

        params.myPhysicsBlockLayerFlags.copy(this._getPhysicsBlockLayersFlags());

        if (this._myUseCleanedVersion) {
            this._myPlayerLocomotion = new CleanedPlayerLocomotion(params);
        } else {
            this._myPlayerLocomotion = new PlayerLocomotion(params);
        }

        this._myStartCounter = 1;
    }

    update(dt) {
        if (this._myStartCounter > 0) {
            this._myStartCounter--;
            if (this._myStartCounter == 0) {
                this._myPlayerLocomotion.start();

                this._myPlayerLocomotion._myPlayerTransformManager.resetReal(true, false, false, true);
                this._myPlayerLocomotion._myPlayerTransformManager.resetHeadToReal();
            }

            this._myPlayerLocomotion._myPlayerHeadManager.update(dt);
        } else {
            getCollisionCheck(this.engine)._myTotalRaycasts = 0; // #TODO Debug stuff, remove later

            this._myPlayerLocomotion.update(dt);
        }

        //getCollisionCheck(this.engine)._myTotalRaycastsMax = Math.max(getCollisionCheck(this.engine)._myTotalRaycasts, getCollisionCheck(this.engine)._myTotalRaycastsMax);
        //console.error(getCollisionCheck(this.engine)._myTotalRaycastsMax);
        //console.error(getCollisionCheck(this.engine)._myTotalRaycasts);
    }

    onActivate() {
        if (this._myStartCounter == 0) {
            if (this._myPlayerLocomotion != null) {
                this._myPlayerLocomotion.setActive(true);
            }
        }
    }

    onDeactivate() {
        if (this._myStartCounter == 0) {
            if (this._myPlayerLocomotion != null) {
                this._myPlayerLocomotion.setActive(false);
            }
        }
    }

    _getPhysicsBlockLayersFlags() {
        let physicsFlags = new PhysicsLayerFlags();

        let flags = [...this._myPhysicsBlockLayerFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        return physicsFlags;
    }
}