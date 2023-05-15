import { RaycastHit } from "../../../../cauldron/physics/physics_raycast_params";
import { quat2_create, vec3_create } from "../../../../plugin/js/extensions/array_extension";

export class CharacterCollisionResults {

    constructor() {
        this.myCheckType = null;

        this.myTransformResults = new CharacterCollisionTransformResults();

        this.myMovementResults = new CharacterCollisionMovementResults();
        this.myHorizontalMovementResults = new CharacterCollisionMovementResults();
        this.myVerticalMovementResults = new CharacterCollisionMovementResults();

        this.myTeleportResults = new CharacterCollisionTeleportResults();

        this.myCheckTransformResults = new CharacterCollisionCheckTransformResults();

        this.myWallSlideResults = new CharacterCollisionWallSlideResults();

        this.myGroundInfo = new CharacterCollisionSurfaceInfo();
        this.myCeilingInfo = new CharacterCollisionSurfaceInfo();

        this.myGroundResults = new CharacterCollisionSurfaceResults();
        this.myCeilingResults = new CharacterCollisionSurfaceResults();

        this.mySplitMovementResults = new CharacterCollisionSplitMovementResults();

        this.myDebugResults = new CharacterCollisionDebugResults();

        this.myInternalResults = new CharacterCollisionInternalResults();
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export let CharacterCollisionCheckType = {
    CHECK_MOVEMENT: 0,
    CHECK_TELEPORT: 1,
    CHECK_TRANSFORM: 2,
    UPDATE_SURFACE_INFO: 3,
    UPDATE_GROUND_INFO: 4,
    UPDATE_CEILING_INFO: 5
};

export class CharacterCollisionSurfaceInfo {

    constructor() {
        this.myOnSurface = false;

        this.mySurfaceAngle = 0;
        this.mySurfacePerceivedAngle = 0;
        this.mySurfaceNormal = vec3_create();

        this.mySurfaceHitMaxAngle = 0;
        this.mySurfaceHitMaxNormal = vec3_create();

        this.mySurfaceDistance = null;

        this.myBaseInsideCollision = false;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionWallSlideResults {

    constructor() {
        this.myHasSlid = false;
        this.mySlideMovementAngle = 0;          // Signed angle between the start movement and the wall slide movement, basically telling you how much u had to change direction to slide
        this.mySlideMovementWallAngle = 0;      // Signed angle between the inverted surface normal and the wall slide movement
        this.myWallNormal = vec3_create();
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionTransformResults {

    constructor() {
        this.myStartTransformQuat = quat2_create();
        this.myEndTransformQuat = quat2_create();
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionMovementResults {

    constructor() {
        this.myStartMovement = vec3_create();
        this.myEndMovement = vec3_create();
        this.myMovementFailed = false;
        this.myMovementCollided = false;
        this.myReferenceCollisionHit = new RaycastHit();
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionTeleportResults {

    constructor() {
        this.myStartTeleportTransformQuat = quat2_create();
        this.myEndTeleportTransformQuat = quat2_create();
        this.myTeleportFailed = false;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionCheckTransformResults {

    constructor() {
        this.myStartCheckTransformQuat = quat2_create();
        this.myEndCheckTransformQuat = quat2_create();
        this.myCheckTransformFailed = false;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionSurfaceResults {

    constructor() {
        this.myHasSnappedOnSurface = false;
        this.myHasPoppedOutSurface = false;
        this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = false;
        this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = false;
        this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = false;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionSplitMovementResults {

    constructor() {
        this.myStepsToPerform = 0;
        this.myStepsPerformed = 0;
        this.myMovementInterrupted = false;
        this.myMovementChecked = vec3_create();
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionDebugResults {

    constructor() {
        this._myRaycastsPerformed = 0;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterCollisionInternalResults {

    constructor() {
        this.myLastRelevantStartHorizontalMovement = vec3_create();
        this.myLastRelevantAdjustedStartHorizontalMovement = vec3_create();
        this.myLastRelevantEndHorizontalMovement = vec3_create();

        this.myLastRelevantStartVerticalMovement = vec3_create();
        this.myLastRelevantAdjustedStartVerticalMovement = vec3_create();
        this.myLastRelevantEndVerticalMovement = vec3_create();

        this.myLastRelevantHasWallSlid = false;
        this.myHasWallSlidTowardOppositeDirection = false;
        this.myLastRelevantWallSlideFlickerPrevented = false;
        this.myWallSlideFlickerPreventionForceCheckCounter = 0;
        this.myWallSlide90DegreesDirectionSign = 0;
        this.myWallSlide90DegreesRecomputeDirectionSign = true;
    }

    reset() {
        // Implemented outside class definition
    }

    copy(other) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CharacterCollisionResults.prototype.reset = function reset() {
    this.myCheckType = null;

    this.myTransformResults.reset();

    this.myMovementResults.reset();
    this.myHorizontalMovementResults.reset();
    this.myVerticalMovementResults.reset();

    this.myTeleportResults.reset();

    this.myCheckTransformResults.reset();

    this.myWallSlideResults.reset();

    this.myGroundInfo.reset();
    this.myCeilingInfo.reset();

    this.myGroundResults.reset();
    this.myCeilingResults.reset();

    this.mySplitMovementResults.reset();

    this.myInternalResults.reset();
};

CharacterCollisionResults.prototype.copy = function copy(other) {
    this.myCheckType = other.myCheckType;

    this.myTransformResults.copy(other.myTransformResults);

    this.myMovementResults.copy(other.myMovementResults);
    this.myHorizontalMovementResults.copy(other.myHorizontalMovementResults);
    this.myVerticalMovementResults.copy(other.myVerticalMovementResults);

    this.myTeleportResults.copy(other.myTeleportResults);

    this.myCheckTransformResults.copy(other.myCheckTransformResults);

    this.myWallSlideResults.copy(other.myWallSlideResults);

    this.myGroundInfo.copy(other.myGroundInfo);
    this.myCeilingInfo.copy(other.myCeilingInfo);

    this.myGroundResults.copy(other.myGroundResults);
    this.myCeilingResults.copy(other.myCeilingResults);

    this.mySplitMovementResults.copy(other.mySplitMovementResults);

    this.myInternalResults.copy(other.myInternalResults);
};

CharacterCollisionSurfaceInfo.prototype.reset = function reset() {
    this.myOnSurface = false;

    this.mySurfaceAngle = 0;
    this.mySurfacePerceivedAngle = 0;
    this.mySurfaceNormal.vec3_zero();

    this.mySurfaceHitMaxAngle = 0;
    this.mySurfaceHitMaxNormal.vec3_zero();

    this.mySurfaceDistance = null;

    this.myBaseInsideCollision = false;
};

CharacterCollisionSurfaceInfo.prototype.copy = function copy(other) {
    this.myOnSurface = other.myOnSurface;

    this.mySurfaceAngle = other.mySurfaceAngle;
    this.mySurfacePerceivedAngle = other.mySurfacePerceivedAngle;
    this.mySurfaceNormal.vec3_copy(other.mySurfaceNormal);

    this.mySurfaceHitMaxAngle = other.mySurfaceHitMaxAngle;
    this.mySurfaceHitMaxNormal.vec3_copy(other.mySurfaceHitMaxNormal);

    this.mySurfaceDistance = other.mySurfaceDistance;

    this.myBaseInsideCollision = other.myBaseInsideCollision;
};

CharacterCollisionWallSlideResults.prototype.reset = function reset() {
    this.myHasSlid = false;
    this.mySlideMovementAngle = 0;
    this.mySlideMovementWallAngle = 0;
    this.myWallNormal.vec3_zero();
};

CharacterCollisionWallSlideResults.prototype.copy = function copy(other) {
    this.myHasSlid = other.myHasSlid;
    this.mySlideMovementAngle = other.mySlideMovementAngle;
    this.mySlideMovementWallAngle = other.mySlideMovementWallAngle;
    this.myWallNormal.vec3_copy(other.myWallNormal);
};

CharacterCollisionTransformResults.prototype.reset = function reset() {
    this.myStartTransformQuat.quat2_identity();
    this.myEndTransformQuat.quat2_identity();
};

CharacterCollisionTransformResults.prototype.copy = function copy(other) {
    this.myStartTransformQuat.quat2_copy(other.myStartTransformQuat);
    this.myEndTransformQuat.quat2_copy(other.myEndTransformQuat);
};

CharacterCollisionMovementResults.prototype.reset = function reset() {
    this.myStartMovement.vec3_zero();
    this.myEndMovement.vec3_zero();
    this.myMovementFailed = false;
    this.myMovementCollided = false;
    this.myReferenceCollisionHit.reset();
};

CharacterCollisionMovementResults.prototype.copy = function copy(other) {
    this.myStartMovement.vec3_copy(other.myStartMovement);
    this.myEndMovement.vec3_copy(other.myEndMovement);
    this.myMovementFailed = other.myMovementFailed;
    this.myMovementCollided = other.myMovementCollided;
    this.myReferenceCollisionHit.copy(other.myReferenceCollisionHit);
};

CharacterCollisionTeleportResults.prototype.reset = function reset() {
    this.myStartTeleportTransformQuat.quat2_identity();
    this.myEndTeleportTransformQuat.quat2_identity();
    this.myTeleportFailed = false;
};

CharacterCollisionTeleportResults.prototype.copy = function copy(other) {
    this.myStartTeleportTransformQuat.quat2_copy(other.myStartTeleportTransformQuat);
    this.myEndTeleportTransformQuat.quat2_copy(other.myEndTeleportTransformQuat);
    this.myTeleportFailed = other.myTeleportFailed;
};

CharacterCollisionCheckTransformResults.prototype.reset = function reset() {
    this.myStartCheckTransformQuat.quat2_identity();
    this.myEndCheckTransformQuat.quat2_identity();
    this.myCheckTransformFailed = false;
};

CharacterCollisionCheckTransformResults.prototype.copy = function copy(other) {
    this.myStartCheckTransformQuat.quat2_copy(other.myStartCheckTransformQuat);
    this.myEndCheckTransformQuat.quat2_copy(other.myEndCheckTransformQuat);
    this.myCheckTransformFailed = other.myCheckTransformFailed;
};

CharacterCollisionSurfaceResults.prototype.reset = function reset() {
    this.myHasSnappedOnSurface = false;
    this.myHasPoppedOutSurface = false;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = false;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = false;
    this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = false;
};

CharacterCollisionSurfaceResults.prototype.copy = function copy(other) {
    this.myHasSnappedOnSurface = other.myHasSnappedOnSurface;
    this.myHasPoppedOutSurface = other.myHasPoppedOutSurface;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = other.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = other.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill;
    this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = other.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill;
};

CharacterCollisionSplitMovementResults.prototype.reset = function reset() {
    this.myStepsToPerform = 0;
    this.myStepsPerformed = 0;
    this.myMovementInterrupted = false;
    this.myMovementChecked.vec3_zero();
};

CharacterCollisionSplitMovementResults.prototype.copy = function copy(other) {
    this.myStepsToPerform = other.myStepsToPerform;
    this.myStepsPerformed = other.myStepsPerformed;
    this.myMovementInterrupted = other.myMovementInterrupted;
    this.myMovementChecked.vec3_copy(other.myMovementChecked);
};

CharacterCollisionDebugResults.prototype.reset = function reset() {
    this._myRaycastsPerformed = 0;
};

CharacterCollisionDebugResults.prototype.copy = function copy(other) {
    this._myRaycastsPerformed = other._myRaycastsPerformed;
};

CharacterCollisionInternalResults.prototype.reset = function reset() {
};

CharacterCollisionInternalResults.prototype.copy = function copy(other) {
    this.myLastRelevantStartHorizontalMovement.vec3_copy(other.myLastRelevantStartHorizontalMovement);
    this.myLastRelevantAdjustedStartHorizontalMovement.vec3_copy(other.myLastRelevantAdjustedStartHorizontalMovement);
    this.myLastRelevantEndHorizontalMovement.vec3_copy(other.myLastRelevantEndHorizontalMovement);

    this.myLastRelevantStartVerticalMovement.vec3_copy(other.myLastRelevantStartVerticalMovement);
    this.myLastRelevantAdjustedStartVerticalMovement.vec3_copy(other.myLastRelevantAdjustedStartVerticalMovement);
    this.myLastRelevantEndVerticalMovement.vec3_copy(other.myLastRelevantEndVerticalMovement);

    this.myLastRelevantHasWallSlid = other.myLastRelevantHasWallSlid;
    this.myHasWallSlidTowardOppositeDirection = other.myHasWallSlidTowardOppositeDirection;
    this.myLastRelevantWallSlideFlickerPrevented = other.myLastRelevantWallSlideFlickerPrevented;
    this.myWallSlideFlickerPreventionForceCheckCounter = other.myWallSlideFlickerPreventionForceCheckCounter;
    this.myWallSlide90DegreesDirectionSign = other.myWallSlide90DegreesDirectionSign;
    this.myWallSlide90DegreesRecomputeDirectionSign = other.myWallSlide90DegreesRecomputeDirectionSign;
};