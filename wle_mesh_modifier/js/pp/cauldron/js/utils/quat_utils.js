import { mat3 as gl_mat3, quat as gl_quat } from "gl-matrix";
import { ArrayUtils } from "./array_utils";
import { Mat3Utils, create as mat3_utils_create } from "./mat3_utils";
import { EasingFunction, MathUtils } from "./math_utils";
import { Vec3Utils, create as vec3_utils_create } from "./vec3_utils";

// glMatrix Bridge

export function create(x, y, z, w) {
    let out = gl_quat.create();

    if (x !== undefined) {
        QuatUtils.set(out, x, y, z, w);
    }

    return out;
}

export function set(quat, x, y, z, w) {
    if (y === undefined) {
        gl_quat.set(quat, x, x, x, x);
    } else {
        gl_quat.set(quat, x, y, z, w);
    }

    return quat;
}

export function normalize(quat, out = QuatUtils.create()) {
    gl_quat.normalize(out, quat);
    return out;
}

export function copy(from, to) {
    gl_quat.copy(to, from);
    return to;
}

export function clone(quat, out = QuatUtils.create()) {
    QuatUtils.copy(quat, out);
    return out;
}

export function identity(quat) {
    gl_quat.identity(quat);
    return quat;
}

export function length(quat) {
    return gl_quat.length(quat);
}

export function lengthSquared(quat) {
    return gl_quat.squaredLength(quat);
}

export function invert(quat, out = QuatUtils.create()) {
    gl_quat.invert(out, quat);
    return out;
}

export function conjugate(quat, out = QuatUtils.create()) {
    gl_quat.conjugate(out, quat);
    return out;
}

export function mul(first, second, out = QuatUtils.create()) {
    gl_quat.mul(out, first, second);
    return out;
}

export let getAxis = function () {
    let zero = vec3_utils_create(0, 0, 0);
    return function getAxis(quat, out = Vec3Utils.create()) {
        let angle = gl_quat.getAxisAngle(out, quat);
        if (angle <= MathUtils.EPSILON) {
            Vec3Utils.copy(zero, out);
        }
        return out;
    };
}();

export function getAngle(quat) {
    return QuatUtils.getAngleDegrees(quat);
}


export function getAngleDegrees(quat) {
    let angle = QuatUtils.getAngleRadians(quat);
    return MathUtils.toDegrees(angle);
}

export let getAngleRadians = function () {
    let vector = vec3_utils_create();
    return function getAngleRadians(quat) {
        let angle = gl_quat.getAxisAngle(vector, quat);
        return angle;
    };
}();

export function getAxisScaled(quat, out = Vec3Utils.create()) {
    return QuatUtils.getAxisScaledDegrees(quat, out);
}

export function getAxisScaledDegrees(quat, out = Vec3Utils.create()) {
    QuatUtils.getAxis(quat, out);
    let angle = QuatUtils.getAngleDegrees(quat);
    Vec3Utils.scale(out, angle, out);
    return out;
}

export let getAxisScaledRadians = function () {
    let zero = vec3_utils_create(0, 0, 0);
    return function getAxisScaledRadians(quat, out = Vec3Utils.create()) {
        QuatUtils.getAxis(quat, out);
        let angle = QuatUtils.getAngleRadians(quat);
        if (angle <= MathUtils.EPSILON) {
            Vec3Utils.copy(zero, out);
        } else {
            Vec3Utils.scale(out, angle, out);
        }
        return out;
    };
}();

export function getAxes(quat, out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
    QuatUtils.getLeft(quat, out[0]);
    QuatUtils.getUp(quat, out[1]);
    QuatUtils.getForward(quat, out[2]);
    return out;
}

export let getForward = function () {
    let rotationMatrix = mat3_utils_create();
    return function getForward(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);
        Vec3Utils.normalize(out, out);

        return out;
    };
}();

export function getBackward(quat, out) {
    QuatUtils.getForward(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export let getLeft = function () {
    let rotationMatrix = mat3_utils_create();
    return function getLeft(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        Vec3Utils.normalize(out, out);

        return out;
    };
}();

export function getRight(quat, out) {
    QuatUtils.getLeft(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export let getUp = function () {
    let rotationMatrix = mat3_utils_create();
    return function getUp(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        Vec3Utils.normalize(out, out);

        return out;
    };
}();

export function getDown(quat, out) {
    QuatUtils.getUp(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export function setAxes(quat, left, up, forward) {
    if (forward != null) {
        return QuatUtils.setForward(quat, forward, up, left);
    } else if (up != null) {
        return QuatUtils.setUp(quat, up, forward, left);
    } else {
        return QuatUtils.setLeft(quat, left, up, forward);
    }
}

export function setForward(quat, forward, up = null, left = null) {
    return _setAxes(quat, [left, up, forward], [2, 1, 0]);
}

export let setBackward = function () {
    let forward = vec3_utils_create();
    return function setBackward(quat, backward, up = null, left = null) {
        Vec3Utils.negate(backward, forward);
        return _setAxes(quat, [left, up, forward], [2, 1, 0]);
    };
}();

export function setUp(quat, up, forward = null, left = null) {
    return _setAxes(quat, [left, up, forward], [1, 2, 0]);
}

export let setDown = function () {
    let up = vec3_utils_create();
    return function setDown(quat, down, forward = null, left = null) {
        Vec3Utils.negate(down, up);
        return _setAxes(quat, [left, up, forward], [1, 2, 0]);
    };
}();

export function setLeft(quat, left, up = null, forward = null) {
    return _setAxes(quat, [left, up, forward], [0, 1, 2]);
}

export let setRight = function () {
    let left = vec3_utils_create();
    return function setRight(quat, right, up = null, forward = null) {
        Vec3Utils.negate(right, left);
        return _setAxes(quat, [left, up, forward], [0, 1, 2]);
    };
}();

export function toWorld(quat, parentQuat, out = QuatUtils.create()) {
    QuatUtils.mul(parentQuat, quat, out);
    return out;
}

export let toLocal = function () {
    let invertQuat = create();
    return function toLocal(quat, parentQuat, out = QuatUtils.create()) {
        QuatUtils.conjugate(parentQuat, invertQuat);
        QuatUtils.mul(invertQuat, quat, out);
        return out;
    };
}();

export function fromAxis(angle, axis, out = QuatUtils.create()) {
    return QuatUtils.fromAxisDegrees(angle, axis, out);
}

export function fromAxisDegrees(angle, axis, out = QuatUtils.create()) {
    QuatUtils.fromAxisRadians(MathUtils.toRadians(angle), axis, out);
    return out;
}

export function fromAxisRadians(angle, axis, out = QuatUtils.create()) {
    gl_quat.setAxisAngle(out, axis, angle);
    return out;
}

export let fromAxes = function () {
    let matrix = mat3_utils_create();
    return function fromAxes(leftAxis, upAxis, forwardAxis, out = QuatUtils.create()) {
        Mat3Utils.fromAxes(leftAxis, upAxis, forwardAxis, matrix);
        return Mat3Utils.toQuat(matrix, out);
    };
}();

// New Functions

export let fromRadians = function () {
    let vector = vec3_utils_create();
    return function fromRadians(radiansRotation, out = QuatUtils.create()) {
        Vec3Utils.toDegrees(radiansRotation, vector);
        return QuatUtils.fromDegrees(vector, out);
    };
}();

export function fromDegrees(degreesRotation, out = QuatUtils.create()) {
    gl_quat.fromEuler(out, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return out;
}

export let toRadians = function () {
    let matrix = mat3_utils_create();
    return function toRadians(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, matrix);

        // Rotation order is ZYX 
        out[1] = Math.asin(-MathUtils.clamp(matrix[2], -1, 1));

        if (Math.abs(matrix[2]) < (1 - MathUtils.EPSILON)) {
            out[0] = Math.atan2(matrix[5], matrix[8]);
            out[2] = Math.atan2(matrix[1], matrix[0]);
        } else {
            out[0] = 0;
            out[2] = Math.atan2(-matrix[3], matrix[4]);
        }

        return out;
    };
}();

export function toDegrees(quat, out = Vec3Utils.create()) {
    QuatUtils.toRadians(quat, out);
    Vec3Utils.toDegrees(out, out);
    return out;
}

export function isNormalized(quat, epsilon = MathUtils.EPSILON) {
    return Math.abs(QuatUtils.lengthSquared(quat) - 1) < epsilon;
}

export function addRotation(first, second, out) {
    return QuatUtils.addRotationDegrees(first, second, out);
}

export let addRotationDegrees = function () {
    let secondQuat = create();
    return function addRotationDegrees(first, second, out) {
        Vec3Utils.degreesToQuat(second, secondQuat);
        return QuatUtils.addRotationQuat(first, secondQuat, out);
    };
}();

export let addRotationRadians = function () {
    let secondQuat = create();
    return function addRotationRadians(first, second, out) {
        Vec3Utils.radiansToQuat(second, secondQuat);
        return QuatUtils.addRotationQuat(first, secondQuat, out);
    };
}();

export function addRotationQuat(first, second, out = QuatUtils.create()) {
    QuatUtils.mul(second, first, out);
    return out;
}

export function subRotation(first, second, out) {
    return QuatUtils.subRotationDegrees(first, second, out);
}

export let subRotationDegrees = function () {
    let secondQuat = create();
    return function subRotationDegrees(first, second, out) {
        Vec3Utils.degreesToQuat(second, secondQuat);
        return QuatUtils.subRotationQuat(first, secondQuat, out);
    };
}();

export let subRotationRadians = function () {
    let secondQuat = create();
    return function subRotationRadians(first, second, out) {
        Vec3Utils.radiansToQuat(second, secondQuat);
        return QuatUtils.subRotationQuat(first, secondQuat, out);
    };
}();

export let subRotationQuat = function () {
    let inverse = create();
    return function subRotationQuat(first, second, out = QuatUtils.create()) {
        QuatUtils.invert(second, inverse);
        QuatUtils.mul(first, inverse, out);

        if (QuatUtils.isNormalized(first) && QuatUtils.isNormalized(second)) {
            // I would normally not normalize quat results since you may want the untouched sub
            // But for normalized params it should be normalized
            // It seems though that for some small error the quat will not be exactly normalized, so I fix it
            QuatUtils.normalize(out, out);
        }

        return out;
    };
}();

export function rotationTo(first, second, out) {
    return QuatUtils.rotationToDegrees(first, second, out);
}

export let rotationToDegrees = function () {
    let secondQuat = create();
    return function rotationToDegrees(first, second, out) {
        Vec3Utils.degreesToQuat(second, secondQuat);
        return QuatUtils.rotationToQuat(first, secondQuat, out);
    };
}();

export let rotationToRadians = function () {
    let secondQuat = create();
    return function rotationToRadians(first, second, out) {
        Vec3Utils.radiansToQuat(second, secondQuat);
        return QuatUtils.rotationToQuat(first, secondQuat, out);
    };
}();

export function rotationToQuat(first, second, out) {
    return QuatUtils.subRotationQuat(second, first, out);
}

export let getTwist = function () {
    let rotationAxis = vec3_utils_create();
    let projection = vec3_utils_create();
    let rotationAlongAxis = create();
    return function getTwist(quat, axis, out = QuatUtils.create()) {
        rotationAxis[0] = quat[0];
        rotationAxis[1] = quat[1];
        rotationAxis[2] = quat[2];

        let dotProd = Vec3Utils.dot(axis, rotationAxis);
        Vec3Utils.scale(axis, dotProd, projection);
        rotationAlongAxis[0] = projection[0];
        rotationAlongAxis[1] = projection[1];
        rotationAlongAxis[2] = projection[2];
        rotationAlongAxis[3] = quat[3];
        QuatUtils.normalize(rotationAlongAxis, rotationAlongAxis);
        if (dotProd < 0) {
            rotationAlongAxis[0] = -rotationAlongAxis[0];
            rotationAlongAxis[1] = -rotationAlongAxis[1];
            rotationAlongAxis[2] = -rotationAlongAxis[2];
            rotationAlongAxis[3] = -rotationAlongAxis[3];
        }

        return QuatUtils.copy(rotationAlongAxis, out);
    };
}();

export let getSwing = function () {
    let twist = create();
    return function getSwing(quat, axis, out = QuatUtils.create()) {
        QuatUtils.getTwist(quat, axis, twist);
        QuatUtils.getSwingFromTwist(quat, twist, out);
        return out;
    };
}();

export function getSwingFromTwist(quat, twist, out = QuatUtils.create()) {
    return QuatUtils.subRotationQuat(quat, twist, out);
}

export let getTwistFromSwing = function () {
    let inverse = create();
    return function getTwistFromSwing(quat, swing, out = QuatUtils.create()) {
        QuatUtils.invert(swing, inverse);
        QuatUtils.addRotationQuat(quat, inverse, out);
        return out;
    };
}();

export function fromTwistSwing(twist, swing, out = QuatUtils.create()) {
    return QuatUtils.addRotationQuat(twist, swing, out);
}

export function toMatrix(quat, out = Mat3Utils.create()) {
    gl_mat3.fromQuat(out, quat);
    return out;
}

export function rotate(first, second, out) {
    return QuatUtils.rotateDegrees(first, second, out);
}

export function rotateDegrees(first, second, out) {
    return QuatUtils.addRotationDegrees(first, second, out);
}

export function rotateRadians(first, second, out) {
    return QuatUtils.addRotationRadians(first, second, out);
}

export function rotateQuat(first, second, out) {
    return QuatUtils.addRotationQuat(first, second, out);
}

export function rotateAxis(quat, angle, axis, out) {
    return QuatUtils.rotateAxisDegrees(quat, angle, axis, out);
}

export let rotateAxisDegrees = function () {
    let secondQuat = create();
    return function rotateAxisDegrees(quat, angle, axis, out) {
        QuatUtils.fromAxisDegrees(angle, axis, secondQuat);
        return QuatUtils.rotateQuat(quat, secondQuat, out);
    };
}();

export let rotateAxisRadians = function () {
    let secondQuat = create();
    return function rotateAxisRadians(quat, angle, axis, out) {
        QuatUtils.fromAxisRadians(angle, axis, secondQuat);
        return QuatUtils.rotateQuat(quat, secondQuat, out);
    };
}();

export function lerp(from, to, interpolationValue, out = QuatUtils.create()) {
    if (interpolationValue <= 0) {
        QuatUtils.copy(from, out);
        return out;
    } else if (interpolationValue >= 1) {
        QuatUtils.copy(to, out);
        return out;
    }

    gl_quat.lerp(out, from, to, interpolationValue);
    return out;
}

export function interpolate(from, to, interpolationValue, easingFunction = EasingFunction.linear, out = QuatUtils.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return QuatUtils.lerp(from, to, lerpValue, out);
}

export function slerp(from, to, interpolationValue, out = QuatUtils.create()) {
    if (interpolationValue <= 0) {
        QuatUtils.copy(from, out);
        return out;
    } else if (interpolationValue >= 1) {
        QuatUtils.copy(to, out);
        return out;
    }

    gl_quat.slerp(out, from, to, interpolationValue);
    return out;
}

export function sinterpolate(from, to, interpolationValue, easingFunction = EasingFunction.linear, out = QuatUtils.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return QuatUtils.slerp(from, to, lerpValue, out);
}

export let QuatUtils = {
    create,
    set,
    normalize,
    copy,
    clone,
    identity,
    length,
    lengthSquared,
    invert,
    conjugate,
    mul,
    getAxis,
    getAngle,
    getAngleDegrees,
    getAngleRadians,
    getAxisScaled,
    getAxisScaledDegrees,
    getAxisScaledRadians,
    getAxes,
    getForward,
    getBackward,
    getLeft,
    getRight,
    getUp,
    getDown,
    setAxes,
    setForward,
    setBackward,
    setUp,
    setDown,
    setLeft,
    setRight,
    toWorld,
    toLocal,
    fromAxis,
    fromAxisDegrees,
    fromAxisRadians,
    fromAxes,
    fromRadians,
    fromDegrees,
    toRadians,
    toDegrees,
    isNormalized,
    addRotation,
    addRotationDegrees,
    addRotationRadians,
    addRotationQuat,
    subRotation,
    subRotationDegrees,
    subRotationRadians,
    subRotationQuat,
    rotationTo,
    rotationToDegrees,
    rotationToRadians,
    rotationToQuat,
    getTwist,
    getSwing,
    getSwingFromTwist,
    getTwistFromSwing,
    fromTwistSwing,
    toMatrix,
    rotate,
    rotateDegrees,
    rotateRadians,
    rotateQuat,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    lerp,
    interpolate,
    slerp,
    sinterpolate
};



let _setAxes = function () {
    let fixedAxes = [vec3_utils_create(), vec3_utils_create(), vec3_utils_create()];

    let fixedAxesFixSignMap = [
        [1, -1, 1],
        [1, 1, -1],
        [-1, 1, -1]
    ];

    let fixedLeft = vec3_utils_create();
    let fixedUp = vec3_utils_create();
    let fixedForward = vec3_utils_create();

    let currentAxis = vec3_utils_create();

    let rotationAxis = vec3_utils_create();
    let rotationMat = mat3_utils_create();
    let rotationQuat = create();
    return function _setAxes(quat, axes, priority) {
        let firstAxis = axes[priority[0]];
        let secondAxis = axes[priority[1]];
        let thirdAxis = axes[priority[2]];

        if (firstAxis == null || Vec3Utils.isZero(firstAxis, MathUtils.EPSILON)) {
            return;
        }

        let secondAxisValid = false;
        if (secondAxis != null) {
            let angleBetween = Vec3Utils.angleRadians(firstAxis, secondAxis);
            if (angleBetween > MathUtils.EPSILON) {
                secondAxisValid = true;
            }
        }

        let thirdAxisValid = false;
        if (thirdAxis != null) {
            let angleBetween = Vec3Utils.angleRadians(firstAxis, thirdAxis);
            if (angleBetween > MathUtils.EPSILON) {
                thirdAxisValid = true;
            }
        }

        if (secondAxisValid || thirdAxisValid) {
            let crossAxis = null;
            let secondAxisIndex = null;
            let thirdAxisIndex = null;
            if (secondAxisValid) {
                crossAxis = secondAxis;
                secondAxisIndex = 1;
                thirdAxisIndex = 2;
            } else {
                crossAxis = thirdAxis;
                secondAxisIndex = 2;
                thirdAxisIndex = 1;
            }

            let fixSignMap = fixedAxesFixSignMap[priority[0]];

            Vec3Utils.cross(firstAxis, crossAxis, fixedAxes[thirdAxisIndex]);
            Vec3Utils.scale(fixedAxes[thirdAxisIndex], fixSignMap[priority[thirdAxisIndex]], fixedAxes[thirdAxisIndex]);

            Vec3Utils.cross(firstAxis, fixedAxes[thirdAxisIndex], fixedAxes[secondAxisIndex]);
            Vec3Utils.scale(fixedAxes[secondAxisIndex], fixSignMap[priority[secondAxisIndex]], fixedAxes[secondAxisIndex]);

            Vec3Utils.cross(fixedAxes[1], fixedAxes[2], fixedAxes[0]);
            Vec3Utils.scale(fixedAxes[0], fixSignMap[priority[0]], fixedAxes[0]);

            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 0)], fixedLeft);
            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 1)], fixedUp);
            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 2)], fixedForward);

            Mat3Utils.set(rotationMat,
                fixedLeft[0], fixedLeft[1], fixedLeft[2],
                fixedUp[0], fixedUp[1], fixedUp[2],
                fixedForward[0], fixedForward[1], fixedForward[2]
            );

            Mat3Utils.toQuat(rotationMat, rotationQuat);
            QuatUtils.normalize(rotationQuat, rotationQuat);

            QuatUtils.copy(rotationQuat, quat);
        } else {
            if (priority[0] == 0) {
                QuatUtils.getLeft(quat, currentAxis);
            } else if (priority[0] == 1) {
                QuatUtils.getUp(quat, currentAxis);
            } else {
                QuatUtils.getForward(quat, currentAxis);
            }

            let angleBetween = Vec3Utils.angleRadians(firstAxis, currentAxis);
            if (angleBetween > MathUtils.EPSILON) {
                Vec3Utils.cross(currentAxis, firstAxis, rotationAxis);
                Vec3Utils.normalize(rotationAxis, rotationAxis);

                if (Vec3Utils.isZero(rotationAxis)) {
                    Vec3Utils.perpendicularRandom(currentAxis, rotationAxis);
                }

                QuatUtils.fromAxisRadians(angleBetween, rotationAxis, rotationQuat);
                QuatUtils.rotateQuat(quat, rotationQuat, quat);
            }
        }

        return quat;
    };
}();