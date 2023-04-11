import { getMainEngine } from "../../../../cauldron/wl/engine_globals";
import { quat2_create } from "../../../../plugin/js/extensions/array_extension";
import { CharacterCollisionResults } from "./character_collision_results";
import { CollisionCheckBridge, getCollisionCheck } from "./collision_check_bridge";

export class CharacterCollisionSystem {

    constructor(engine = getMainEngine()) {
        this._myLastCheckRaycastsPerformed = 0;
        this._myCurrentFrameRaycastsPerformed = 0;
        this._myMaxFrameRaycastsPerformed = 0;

        this.myEngine = engine;

        CollisionCheckBridge.initBridge(this.myEngine);
    }

    update(dt) {
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        this._myCurrentFrameRaycastsPerformed = 0;
        getCollisionCheck(this.myEngine)._myTotalRaycasts = 0;
    }

    checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        CollisionCheckBridge.checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults, this.myEngine);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    checkTeleportToPosition(teleportPosition, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        // Implemented outside class definition
    }

    checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        CollisionCheckBridge.checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults, this.myEngine);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        CollisionCheckBridge.checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults, this.myEngine);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateSurfaceInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        let currentFramePerformedRaycasts = this._myCurrentFrameRaycastsPerformed;

        this.updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);
        this.updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - currentFramePerformedRaycasts;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        CollisionCheckBridge.updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults, this.myEngine);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults()) {
        CollisionCheckBridge.updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults, this.myEngine);

        this._myLastCheckRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = getCollisionCheck(this.myEngine)._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }
}



// IMPLEMENTATION

CharacterCollisionSystem.prototype.checkTeleportToPosition = function () {
    let teleportTransformQuat = quat2_create();
    return function checkTeleportToPosition(teleportPosition, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults) {
        teleportTransformQuat.quat2_copy(currentTransformQuat);
        teleportTransformQuat.quat2_setPosition(teleportPosition);
        this.checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);
    };
}();