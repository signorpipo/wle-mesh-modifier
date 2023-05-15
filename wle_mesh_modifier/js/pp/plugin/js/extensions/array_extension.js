/*
    How to use

    Warning: The extension is a WIP so not all the functions are available for all kinds of vector.

    By default rotations are in Degrees and transforms are Matrix 4 (and not Quat 2)    
    For functions that work with rotations, Matrix means Matrix 3 and Quat means Quat
    For functions that work with transforms, Matrix means Matrix 4 and Quat means Quat 2
    
    For rotations u can add a suffix like Degrees/Radians/Quat/Matrix to use a specific version, example:
        - vec3_rotateAroundRadians
        - vec3_degreesAddRotationDegrees
        
    For transform u can add a suffix like Quat/Matrix to use a specific version, example:
        - vec3_convertPositionToWorldMatrix
        - vec3_convertDirectionToWorldQuat

    Some vec3 functions let u add a prefix to specify if the vec3 represent a rotation in degrees or radians, where degrees is the default:
        - vec3_toQuat
        - vec3_degreesToQuat
        - vec3_radiansToQuat
        - vec3_degreesAddRotation

    Rotation operations return a rotation of the same kind of the starting variable:
        - vec3_degreesAddRotationQuat   -> returns a rotation in degrees
        - quat_addRotationDegrees       -> returns a rotation in quat

    The functions leave u the choice of forwarding an out parameter or just get the return value, example:
        - let quat = this.vec3_toQuat()
        - this.vec3_toQuat(quat)
        - the out parameter is always the last one

    List of functions:
        Notes:
            - If a group of functions starts with ○ it means it modifies the variable itself
            - The suffixes (like Matrix or Radians) or prefixes (like degrees) are omitted 

        CREATION (u can call these functions without any object):
            - vec2_create
            - vec3_create
            - vec4_create
            - quat_create
            - quat2_create
            - mat3_create
            - mat4_create

        ARRAY:
            - pp_first      / pp_last
            - pp_has        / pp_hasEqual
            - pp_find       / pp_findIndex      / pp_findAll            / pp_findAllIndexes / pp_findEqual      / pp_findAllEqual   / pp_findIndexEqual / pp_findAllIndexesEqual
            ○ pp_remove     / pp_removeIndex    / pp_removeAllIndexes   / pp_removeAll      / pp_removeEqual    / pp_removeAllEqual
            ○ pp_pushUnique / pp_unshiftUnique
            ○ pp_copy    
            - pp_clone      
            - pp_equals      
            ○ pp_clear      

        GENERIC VECTOR (array with only numbers):
            - vec_scale
            - vec_round     / vec_floor         / vec_ceil      / vec_clamp
            - vec_log       / vec_error         / vec_warn   
            - vec_equals   

        VECTOR 2:
            ○ vec2_set      / vec2_copy     / vec2_zero
            - vec2_clone 
            - vec2_normalize
            - vec2_length
            - vec2_isZero

        VECTOR 3:
            ○ vec3_set      / vec3_copy     / vec3_zero
            - vec3_clone 
            - vec3_normalize    / vec3_negate
            - vec3_isNormalized / vec3_isZero
            - vec3_length       / vec3_lengthSquared        / vec3_lengthSigned
            - vec3_distance     / vec3_distanceSquared
            - vec3_add              / vec3_sub              / vec3_mul      / vec3_div      / vec3_scale    / vec3_dot
            - vec3_equals
            - vec3_transformQuat    / vec3_transformMat3    / vec3_transformMat4
            - vec3_componentAlongAxis           / vec3_removeComponentAlongAxis / vec3_copyComponentAlongAxis   / vec3_valueAlongAxis  
            - vec3_isConcordant
            - vec3_isFartherAlongAxis
            - vec3_isToTheRight
            - vec3_isOnAxis
            - vec3_isOnPlane
            - vec3_signTo
            - vec3_projectOnAxis                / vec3_projectOnAxisAlongAxis
            - vec3_projectOnPlane               / vec3_projectOnPlaneAlongAxis
            - vec3_convertPositionToWorld       / vec3_convertPositionToLocal 
            - vec3_convertDirectionToWorld      / vec3_convertDirectionToLocal   
            - vec3_angle
            - vec3_rotate           / vec3_rotateAxis           / vec3_rotateAround / vec3_rotateAroundAxis
            - vec3_rotationTo       / vec3_rotationToPivoted
            - vec3_toRadians        / vec3_toDegrees            / vec3_toQuat       / vec3_toMatrix
            - vec3_addRotation  
            - vec3_lerp      / vec3_interpolate 
            - vec3_perpendicularRandom 
            
        VECTOR 4:
            ○ vec4_set      / vec4_copy
            - vec4_clone 

        QUAT:
            ○ quat_set          / quat_copy     / quat_identity
            - quat_clone 
            - quat_normalize    / quat_invert   / quat_conjugate
            - quat_isNormalized
            - quat_length       / quat_lengthSquared
            - quat_mul
            - quat_getAxis          / quat_getAngle         / quat_getAxisScaled
            - quat_getAxes          / quat_getRight         / quat_getUp    / quat_getForward   / quat_getLeft  / quat_getDown  / quat_getBackward
            ○ quat_setAxes          / quat_setRight         / quat_setUp    / quat_setForward   / quat_setLeft  / quat_setDown  / quat_setBackward
            - quat_toWorld          / quat_toLocal
            - quat_rotate           / quat_rotateAxis  
            - quat_rotationTo     
            - quat_getTwist         / quat_getSwing         / quat_getTwistFromSwing    / quat_getSwingFromTwist    / quat_fromTwistSwing
            ○ quat_fromRadians      / quat_fromDegrees      / quat_fromAxis / quat_fromAxes
            - quat_toRadians        / quat_toDegrees        / quat_toMatrix
            - quat_addRotation      / quat_subRotation
            - quat_lerp             / quat_interpolate      / quat_slerp    / quat_sinterpolate

        QUAT 2:
            ○ quat2_set             / quat2_copy        / quat2_identity
            - quat2_normalize       / quat2_invert      / quat2_conjugate
            - quat2_isNormalized
            - quat2_length          / quat2_lengthSquared
            - quat2_mul
            - quat2_getPosition     / quat2_getRotation
            ○ quat2_setPosition     / quat2_setRotation     / quat2_setPositionRotation
            - quat2_getAxes     / quat2_getRight    / quat2_getUp   / quat2_getForward  / quat2_getLeft    / quat2_getDown   / quat2_getBackward
            - quat2_toWorld     / quat2_toLocal
            - quat2_rotateAxis  
            - quat2_toMatrix
            ○ quat2_fromMatrix
            - quat2_lerp        / quat2_interpolate

        MATRIX 3:
            ○ mat3_set
            - mat3_toDegrees    / mat3_toRadians    / mat3_toQuat
            - mat3_fromAxes

        MATRIX 4:
            ○ mat4_set          / mat4_copy         / mat4_identity
            - mat4_clone
            - mat4_invert
            - mat_mul           / mat4_scale
            - mat4_getPosition  / mat4_getRotation  / mat4_getScale
            ○ mat4_setPosition  / mat4_setRotation  / mat4_setScale
            ○ mat4_setPositionRotation      / mat4_setPositionRotationScale
            - mat4_getAxes     / mat4_getRight    / mat4_getUp   / mat4_getForward  / mat4_getLeft    / mat4_getDown   / mat4_getBackward
            - mat4_toWorld      / mat4_toLocal
            - mat4_hasUniformScale
            - mat4_toQuat
            ○ mat4_fromQuat
*/

import { ArrayUtils } from "../../../cauldron/js/utils/array_utils";
import { Mat3Utils } from "../../../cauldron/js/utils/mat3_utils";
import { Mat4Utils } from "../../../cauldron/js/utils/mat4_utils";
import { EasingFunction, MathUtils } from "../../../cauldron/js/utils/math_utils";
import { Quat2Utils } from "../../../cauldron/js/utils/quat2_utils";
import { QuatUtils } from "../../../cauldron/js/utils/quat_utils";
import { Vec2Utils } from "../../../cauldron/js/utils/vec2_utils";
import { Vec3Utils } from "../../../cauldron/js/utils/vec3_utils";
import { Vec4Utils } from "../../../cauldron/js/utils/vec4_utils";
import { VecUtils } from "../../../cauldron/js/utils/vec_utils";
import { PluginUtils } from "../../utils/plugin_utils";

export function initArrayExtension() {
    initArrayExtensionProtoype();
}

export function vec2_create(x, y) {
    return Vec2Utils.create(...arguments);
};

export function vec3_create(x, y, z) {
    return Vec3Utils.create(...arguments);
};

export function vec4_create(x, y, z, w) {
    return Vec4Utils.create(...arguments);
};

export function quat_create(x, y, z, w) {
    return QuatUtils.create(...arguments);
};

export function quat2_create(x1, y1, z1, w1, x2, y2, z2, w2) {
    return Quat2Utils.create(...arguments);
};

export function mat3_create(
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22) {
    return Mat3Utils.create(...arguments);
};

export function mat4_create(
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {
    return Mat4Utils.create(...arguments);
};

export function initArrayExtensionProtoype() {

    // ARRAY

    // New Functions

    let arrayExtension = {};

    arrayExtension.pp_first = function pp_first() {
        return ArrayUtils.first(this, ...arguments);
    };

    arrayExtension.pp_last = function pp_last() {
        return ArrayUtils.last(this, ...arguments);
    };

    arrayExtension.pp_has = function pp_has(callback) {
        return ArrayUtils.has(this, ...arguments);
    };

    arrayExtension.pp_hasEqual = function pp_hasEqual(elementToFind, elementsEqualCallback = null) {
        return ArrayUtils.hasEqual(this, ...arguments);
    };

    arrayExtension.pp_find = function pp_find(callback) {
        return ArrayUtils.find(this, ...arguments);
    };

    arrayExtension.pp_findIndex = function pp_findIndex(callback) {
        return ArrayUtils.findIndex(this, ...arguments);
    };

    arrayExtension.pp_findAll = function pp_findAll(callback) {
        return ArrayUtils.findAll(this, ...arguments);
    };

    arrayExtension.pp_findAllIndexes = function pp_findAllIndexes(callback) {
        return ArrayUtils.findAllIndexes(this, ...arguments);
    };

    arrayExtension.pp_findEqual = function pp_findEqual(elementToFind, elementsEqualCallback = null) {
        return ArrayUtils.findEqual(this, ...arguments);
    };

    arrayExtension.pp_findAllEqual = function pp_findAllEqual(elementToFind, elementsEqualCallback = null) {
        return ArrayUtils.findAllEqual(this, ...arguments);
    };

    arrayExtension.pp_findIndexEqual = function pp_findIndexEqual(elementToFind, elementsEqualCallback = null) {
        return ArrayUtils.findIndexEqual(this, ...arguments);
    };

    arrayExtension.pp_findAllIndexesEqual = function pp_findAllIndexesEqual(elementToFind, elementsEqualCallback = null) {
        return ArrayUtils.findAllIndexesEqual(this, ...arguments);
    };

    arrayExtension.pp_removeIndex = function pp_removeIndex(index) {
        return ArrayUtils.removeIndex(this, ...arguments);
    };

    arrayExtension.pp_removeAllIndexes = function pp_removeAllIndexes(indexes) {
        return ArrayUtils.removeAllIndexes(this, ...arguments);
    };

    arrayExtension.pp_remove = function pp_remove(callback) {
        return ArrayUtils.remove(this, ...arguments);
    };

    arrayExtension.pp_removeAll = function pp_removeAll(callback) {
        return ArrayUtils.removeAll(this, ...arguments);
    };

    arrayExtension.pp_removeEqual = function pp_removeEqual(elementToRemove, elementsEqualCallback = null) {
        return ArrayUtils.removeEqual(this, ...arguments);
    };

    arrayExtension.pp_removeAllEqual = function pp_removeAllEqual(elementToRemove, elementsEqualCallback = null) {
        return ArrayUtils.removeAllEqual(this, ...arguments);
    };

    arrayExtension.pp_pushUnique = function pp_pushUnique(element, elementsEqualCallback = null) {
        return ArrayUtils.pushUnique(this, ...arguments);
    };

    arrayExtension.pp_unshiftUnique = function pp_unshiftUnique(element, elementsEqualCallback = null) {
        return ArrayUtils.unshiftUnique(this, ...arguments);
    };

    arrayExtension.pp_copy = function pp_copy(array, copyCallback = null) {
        return ArrayUtils.copy(array, this, copyCallback);
    };

    arrayExtension.pp_clone = function pp_clone(cloneCallback = null) {
        return ArrayUtils.clone(this, ...arguments);
    };

    arrayExtension.pp_equals = function pp_equals(array, elementsEqualCallback = null) {
        return ArrayUtils.equals(this, ...arguments);
    };

    arrayExtension.pp_clear = function pp_clear() {
        return ArrayUtils.clear(this, ...arguments);
    };

    // VECTOR

    // New Functions

    let vecExtension = {}

    vecExtension.vec_toString = function vec_toString(decimalPlaces = null) {
        return VecUtils.toString(this, ...arguments);
    };

    vecExtension.vec_log = function vec_log(decimalPlaces = 4) {
        return VecUtils.log(this, ...arguments);
    };

    vecExtension.vec_error = function vec_error(decimalPlaces = 4) {
        return VecUtils.error(this, ...arguments);
    };

    vecExtension.vec_warn = function vec_warn(decimalPlaces = 4) {
        return VecUtils.warn(this, ...arguments);
    };

    vecExtension.vec_scale = function vec_scale(value, out = null) {
        return VecUtils.scale(this, ...arguments);
    };

    vecExtension.vec_round = function vec_round(out = null) {
        return VecUtils.round(this, ...arguments);
    };

    vecExtension.vec_floor = function vec_floor(out = null) {
        return VecUtils.floor(this, ...arguments);
    };

    vecExtension.vec_ceil = function vec_ceil(out = null) {
        return VecUtils.ceil(this, ...arguments);
    };

    vecExtension.vec_clamp = function vec_clamp(start, end, out = null) {
        return VecUtils.clamp(this, ...arguments);
    };

    vecExtension.vec_equals = function vec_equals(vector, epsilon = 0) {
        return VecUtils.equals(this, ...arguments);
    };

    // VECTOR 2

    let vec2Extension = {};

    vec2Extension.vec2_set = function vec2_set(x, y) {
        return Vec2Utils.set(this, ...arguments);
    };

    // glMatrix Bridge

    vec2Extension.vec2_length = function vec2_length() {
        return Vec2Utils.length(this, ...arguments);
    };

    vec2Extension.vec2_normalize = function vec2_normalize(out = Vec2Utils.create()) {
        return Vec2Utils.normalize(this, ...arguments);
    };

    vec2Extension.vec2_copy = function vec2_copy(vector) {
        return Vec2Utils.copy(vector, this);
    };

    vec2Extension.vec2_clone = function vec2_clone(out = Vec2Utils.create()) {
        return Vec2Utils.clone(this, ...arguments);
    };

    vec2Extension.vec2_zero = function vec2_zero() {
        return Vec2Utils.zero(this, ...arguments);
    };

    // New Functions

    vec2Extension.vec2_isZero = function vec2_isZero(epsilon = 0) {
        return Vec2Utils.isZero(this, ...arguments);
    };

    // VECTOR 3

    let vec3Extension = {};

    // glMatrix Bridge

    vec3Extension.vec3_set = function vec3_set(x, y, z) {
        return Vec3Utils.set(this, ...arguments);
    };

    vec3Extension.vec3_normalize = function vec3_normalize(out = Vec3Utils.create()) {
        return Vec3Utils.normalize(this, ...arguments);
    };
    vec3Extension.vec3_copy = function vec3_copy(vector) {
        return Vec3Utils.copy(vector, this);
    };

    vec3Extension.vec3_clone = function vec3_clone(out = Vec3Utils.create()) {
        return Vec3Utils.clone(this, ...arguments);
    };

    vec3Extension.vec3_zero = function vec3_zero() {
        return Vec3Utils.zero(this, ...arguments);
    };

    vec3Extension.vec3_angle = function vec3_angle(vector) {
        return Vec3Utils.angle(this, ...arguments);
    };

    vec3Extension.vec3_angleDegrees = function vec3_angleDegrees(vector) {
        return Vec3Utils.angleDegrees(this, ...arguments);
    };

    vec3Extension.vec3_angleRadians = function vec3_angleRadians(vector) {
        return Vec3Utils.angleRadians(this, ...arguments);
    };

    vec3Extension.vec3_equals = function vec3_equals(vector, epsilon = 0) {
        return Vec3Utils.equals(this, ...arguments);
    };

    vec3Extension.vec3_length = function vec3_length() {
        return Vec3Utils.length(this, ...arguments);
    };

    vec3Extension.vec3_lengthSquared = function vec3_lengthSquared() {
        return Vec3Utils.lengthSquared(this, ...arguments);
    };

    vec3Extension.vec3_distance = function vec3_distance(vector) {
        return Vec3Utils.distance(this, ...arguments);
    };

    vec3Extension.vec3_distanceSquared = function vec3_distanceSquared(vector) {
        return Vec3Utils.distanceSquared(this, ...arguments);
    };

    vec3Extension.vec3_add = function vec3_add(vector, out = Vec3Utils.create()) {
        return Vec3Utils.add(this, ...arguments);
    };

    vec3Extension.vec3_sub = function vec3_sub(vector, out = Vec3Utils.create()) {
        return Vec3Utils.sub(this, ...arguments);
    };

    vec3Extension.vec3_mul = function vec3_mul(vector, out = Vec3Utils.create()) {
        return Vec3Utils.mul(this, ...arguments);
    };

    vec3Extension.vec3_div = function vec3_div(vector, out = Vec3Utils.create()) {
        return Vec3Utils.div(this, ...arguments);
    };

    vec3Extension.vec3_scale = function vec3_scale(value, out = Vec3Utils.create()) {
        return Vec3Utils.scale(this, ...arguments);
    };

    vec3Extension.vec3_dot = function vec3_dot(vector) {
        return Vec3Utils.dot(this, ...arguments);
    };

    vec3Extension.vec3_negate = function vec3_negate(out = Vec3Utils.create()) {
        return Vec3Utils.negate(this, ...arguments);
    };

    vec3Extension.vec3_cross = function vec3_cross(vector, out = Vec3Utils.create()) {
        return Vec3Utils.cross(this, ...arguments);
    };

    vec3Extension.vec3_transformQuat = function vec3_transformQuat(quat, out = Vec3Utils.create()) {
        return Vec3Utils.transformQuat(this, ...arguments);
    };

    vec3Extension.vec3_transformMat3 = function vec3_transformMat3(matrix, out = Vec3Utils.create()) {
        return Vec3Utils.transformMat3(this, ...arguments);
    };

    vec3Extension.vec3_transformMat4 = function vec3_transformMat4(matrix, out = Vec3Utils.create()) {
        return Vec3Utils.transformMat4(this, ...arguments);
    };

    // New Functions

    vec3Extension.vec3_lengthSigned = function vec3_lengthSigned(positiveDirection) {
        return Vec3Utils.lengthSigned(this, ...arguments);
    };

    vec3Extension.vec3_angleSigned = function vec3_angleSigned(vector, upAxis) {
        return Vec3Utils.angleSigned(this, ...arguments);
    };

    vec3Extension.vec3_angleSignedDegrees = function vec3_angleSignedDegrees(vector, upAxis) {
        return Vec3Utils.angleSignedDegrees(this, ...arguments);
    };

    vec3Extension.vec3_angleSignedRadians = function vec3_angleSignedRadians(vector, upAxis) {
        return Vec3Utils.angleSignedRadians(this, ...arguments);
    };

    vec3Extension.vec3_toRadians = function vec3_toRadians(out = Vec3Utils.create()) {
        return Vec3Utils.toRadians(this, ...arguments);
    };

    vec3Extension.vec3_toDegrees = function vec3_toDegrees(out = Vec3Utils.create()) {
        return Vec3Utils.toDegrees(this, ...arguments);
    };

    vec3Extension.vec3_toQuat = function vec3_toQuat(out) {
        return Vec3Utils.toQuat(this, ...arguments);
    };

    vec3Extension.vec3_radiansToQuat = function vec3_radiansToQuat(out = QuatUtils.create()) {
        return Vec3Utils.radiansToQuat(this, ...arguments);
    };

    vec3Extension.vec3_degreesToQuat = function vec3_degreesToQuat(out = QuatUtils.create()) {
        return Vec3Utils.degreesToQuat(this, ...arguments);
    };

    vec3Extension.vec3_isNormalized = function vec3_isNormalized(epsilon = MathUtils.EPSILON) {
        return Vec3Utils.isNormalized(this, ...arguments);
    };

    vec3Extension.vec3_isZero = function vec3_isZero(epsilon = 0) {
        return Vec3Utils.isZero(this, ...arguments);
    };

    vec3Extension.vec3_componentAlongAxis = function vec3_componentAlongAxis(axis, out = Vec3Utils.create()) {
        return Vec3Utils.componentAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_valueAlongAxis = function vec3_valueAlongAxis(axis) {
        return Vec3Utils.valueAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_removeComponentAlongAxis = function vec3_removeComponentAlongAxis(axis, out = Vec3Utils.create()) {
        return Vec3Utils.removeComponentAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_copyComponentAlongAxis = function vec3_copyComponentAlongAxis(vector, axis, out = Vec3Utils.create()) {
        return Vec3Utils.copyComponentAlongAxis(vector, this, axis, out);
    };

    vec3Extension.vec3_isConcordant = function vec3_isConcordant(vector) {
        return Vec3Utils.isConcordant(this, ...arguments);
    };

    vec3Extension.vec3_isFartherAlongAxis = function vec3_isFartherAlongAxis(vector, axis) {
        return Vec3Utils.isFartherAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_isToTheRight = function vec3_isToTheRight(vector, upAxis) {
        return Vec3Utils.isToTheRight(this, ...arguments);
    };

    vec3Extension.vec3_signTo = function vec3_signTo(vector, upAxis, zeroSign = 1) {
        return Vec3Utils.signTo(this, ...arguments);
    };

    vec3Extension.vec3_projectOnAxis = function vec3_projectOnAxis(axis, out = Vec3Utils.create()) {
        return Vec3Utils.projectOnAxis(this, ...arguments);
    };

    vec3Extension.vec3_projectOnAxisAlongAxis = function vec3_projectOnAxisAlongAxis(axis, projectAlongAxis, out = Vec3Utils.create()) {
        return Vec3Utils.projectOnAxisAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_projectOnPlane = function vec3_projectOnPlane(planeNormal, out = Vec3Utils.create()) {
        return Vec3Utils.projectOnPlane(this, ...arguments);
    };

    vec3Extension.vec3_projectOnPlaneAlongAxis = function vec3_projectOnPlaneAlongAxis(planeNormal, projectAlongAxis, out = Vec3Utils.create()) {
        return Vec3Utils.projectOnPlaneAlongAxis(this, ...arguments);
    };

    vec3Extension.vec3_isOnAxis = function vec3_isOnAxis(axis) {
        return Vec3Utils.isOnAxis(this, ...arguments);
    };

    vec3Extension.vec3_isOnPlane = function vec3_isOnPlane(planeNormal) {
        return Vec3Utils.isOnPlane(this, ...arguments);
    };

    vec3Extension.vec3_rotate = function vec3_rotate(rotation, out) {
        return Vec3Utils.rotate(this, ...arguments);
    };

    vec3Extension.vec3_rotateDegrees = function vec3_rotateDegrees(rotation, out) {
        return Vec3Utils.rotateDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotateRadians = function vec3_rotateRadians(rotation, out) {
        return Vec3Utils.rotateRadians(this, ...arguments);
    };

    vec3Extension.vec3_rotateQuat = function vec3_rotateQuat(rotation, out) {
        return Vec3Utils.rotateQuat(this, ...arguments);
    };

    vec3Extension.vec3_rotateAxis = function vec3_rotateAxis(angle, axis, out) {
        return Vec3Utils.rotateAxis(this, ...arguments);
    };

    vec3Extension.vec3_rotateAxisDegrees = function vec3_rotateAxisDegrees(angle, axis, out) {
        return Vec3Utils.rotateAxisDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotateAxisRadians = function vec3_rotateAxisRadians(angle, axis, out) {
        return Vec3Utils.rotateAxisRadians(this, ...arguments);
    };

    vec3Extension.vec3_rotateAround = function vec3_rotateAround(rotation, origin, out) {
        return Vec3Utils.rotateAround(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundDegrees = function vec3_rotateAroundDegrees(rotation, origin, out = Vec3Utils.create()) {
        return Vec3Utils.rotateAroundDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundRadians = function vec3_rotateAroundRadians(rotation, origin, out = Vec3Utils.create()) {
        return Vec3Utils.rotateAroundRadians(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundQuat = function vec3_rotateAroundQuat(rotation, origin, out = Vec3Utils.create()) {
        return Vec3Utils.rotateAroundQuat(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundAxis = function vec3_rotateAroundAxis(angle, axis, origin, out) {
        return Vec3Utils.rotateAroundAxis(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundAxisDegrees = function vec3_rotateAroundAxisDegrees(angle, axis, origin, out) {
        return Vec3Utils.rotateAroundAxisDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotateAroundAxisRadians = function vec3_rotateAroundAxisRadians(angle, axis, origin, out = Vec3Utils.create()) {
        return Vec3Utils.rotateAroundAxisRadians(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToWorld = function vec3_convertPositionToWorld(parentTransform, out) {
        return Vec3Utils.convertPositionToWorld(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToLocal = function vec3_convertPositionToLocal(parentTransform, out) {
        return Vec3Utils.convertPositionToLocal(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToWorldMatrix = function vec3_convertPositionToWorldMatrix(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertPositionToWorldMatrix(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToLocalMatrix = function vec3_convertPositionToLocalMatrix(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertPositionToLocalMatrix(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToWorldQuat = function vec3_convertPositionToWorldQuat(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertPositionToWorldQuat(this, ...arguments);
    };

    vec3Extension.vec3_convertPositionToLocalQuat = function vec3_convertPositionToLocalQuat(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertPositionToLocalQuat(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToWorld = function vec3_convertDirectionToWorld(parentTransform, out) {
        return Vec3Utils.convertDirectionToWorld(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToLocal = function vec3_convertDirectionToLocal(parentTransform, out) {
        return Vec3Utils.convertDirectionToLocal(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToWorldMatrix = function vec3_convertDirectionToWorldMatrix(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertDirectionToWorldMatrix(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToLocalMatrix = function vec3_convertDirectionToLocalMatrix(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertDirectionToLocalMatrix(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToWorldQuat = function vec3_convertDirectionToWorldQuat(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertDirectionToWorldQuat(this, ...arguments);
    };

    vec3Extension.vec3_convertDirectionToLocalQuat = function vec3_convertDirectionToLocalQuat(parentTransform, out = Vec3Utils.create()) {
        return Vec3Utils.convertDirectionToLocalQuat(this, ...arguments);
    };

    vec3Extension.vec3_addRotation = function vec3_addRotation(rotation, out) {
        return Vec3Utils.addRotation(this, ...arguments);
    };

    vec3Extension.vec3_addRotationDegrees = function vec3_addRotationDegrees(rotation, out) {
        return Vec3Utils.addRotationDegrees(this, ...arguments);
    };

    vec3Extension.vec3_addRotationRadians = function vec3_addRotationRadians(rotation, out) {
        return Vec3Utils.addRotationRadians(this, ...arguments);
    };

    vec3Extension.vec3_addRotationQuat = function vec3_addRotationQuat(rotation, out) {
        return Vec3Utils.addRotationQuat(this, ...arguments);
    };

    vec3Extension.vec3_degreesAddRotation = function vec3_degreesAddRotation(rotation, out) {
        return Vec3Utils.degreesAddRotation(this, ...arguments);
    };

    vec3Extension.vec3_degreesAddRotationDegrees = function vec3_degreesAddRotationDegrees(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.degreesAddRotationDegrees(this, ...arguments);
    };

    vec3Extension.vec3_degreesAddRotationRadians = function vec3_degreesAddRotationRadians(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.degreesAddRotationRadians(this, ...arguments);
    };

    vec3Extension.vec3_degreesAddRotationQuat = function vec3_degreesAddRotationQuat(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.degreesAddRotationQuat(this, ...arguments);
    };

    vec3Extension.vec3_radiansAddRotation = function vec3_radiansAddRotation(rotation, out) {
        return Vec3Utils.radiansAddRotation(this, ...arguments);
    };

    vec3Extension.vec3_radiansAddRotationDegrees = function vec3_radiansAddRotationDegrees(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.radiansAddRotationDegrees(this, ...arguments);
    };

    vec3Extension.vec3_radiansAddRotationRadians = function vec3_radiansAddRotationRadians(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.radiansAddRotationRadians(this, ...arguments);
    };

    vec3Extension.vec3_radiansAddRotationQuat = function vec3_radiansAddRotationQuat(rotation, out = Vec3Utils.create()) {
        return Vec3Utils.radiansAddRotationQuat(this, ...arguments);
    };

    vec3Extension.vec3_toMatrix = function vec3_toMatrix(out = Mat3Utils.create()) {
        return Vec3Utils.toMatrix(this, ...arguments);
    };

    vec3Extension.vec3_degreesToMatrix = function vec3_degreesToMatrix(out = Mat3Utils.create()) {
        return Vec3Utils.degreesToMatrix(this, ...arguments);
    };

    vec3Extension.vec3_radiansToMatrix = function vec3_radiansToMatrix(out = Mat3Utils.create()) {
        return Vec3Utils.radiansToMatrix(this, ...arguments);
    };

    vec3Extension.vec3_rotationTo = function vec3_rotationTo(direction, out) {
        return Vec3Utils.rotationTo(this, ...arguments);
    };

    vec3Extension.vec3_rotationToDegrees = function vec3_rotationToDegrees(direction, out = Vec3Utils.create()) {
        return Vec3Utils.rotationToDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotationToRadians = function vec3_rotationToRadians(direction, out = Vec3Utils.create()) {
        return Vec3Utils.rotationToRadians(this, ...arguments);
    };

    vec3Extension.vec3_rotationToQuat = function vec3_rotationToQuat(direction, out = QuatUtils.create()) {
        return Vec3Utils.rotationToQuat(this, ...arguments);
    };

    vec3Extension.vec3_rotationToPivoted = function vec3_rotationToPivoted(direction, pivotAxis, out) {
        return Vec3Utils.rotationToPivoted(this, ...arguments);
    };

    vec3Extension.vec3_rotationToPivotedDegrees = function vec3_rotationToPivotedDegrees(direction, pivotAxis, out = Vec3Utils.create()) {
        return Vec3Utils.rotationToPivotedDegrees(this, ...arguments);
    };

    vec3Extension.vec3_rotationToPivotedRadians = function vec3_rotationToPivotedRadians(direction, pivotAxis, out = Vec3Utils.create()) {
        return Vec3Utils.rotationToPivotedRadians(this, ...arguments);
    };

    vec3Extension.vec3_rotationToPivotedQuat = function vec3_rotationToPivotedQuat(direction, pivotAxis, out = QuatUtils.create()) {
        return Vec3Utils.rotationToPivotedQuat(this, ...arguments);
    };

    vec3Extension.vec3_lerp = function vec3_lerp(to, interpolationValue, out = Vec3Utils.create()) {
        return Vec3Utils.lerp(this, ...arguments);
    };

    vec3Extension.vec3_interpolate = function vec3_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = Vec3Utils.create()) {
        return Vec3Utils.interpolate(this, ...arguments);
    };

    vec3Extension.vec3_perpendicularRandom = function vec3_perpendicularRandom(out = Vec3Utils.create()) {
        return Vec3Utils.perpendicularRandom(this, ...arguments);
    };

    // VECTOR 4

    let vec4Extension = {};

    // glMatrix Bridge

    vec4Extension.vec4_set = function vec4_set(x, y, z, w) {
        return Vec4Utils.set(this, ...arguments);
    };

    vec4Extension.vec4_copy = function vec4_copy(vector) {
        return Vec4Utils.set(vector, this);
    };

    vec4Extension.vec4_clone = function vec4_clone(out = Vec4Utils.create()) {
        return Vec4Utils.set(this, ...arguments);
    };

    // QUAT

    let quatExtension = {};

    // glMatrix Bridge

    quatExtension.quat_set = function quat_set(x, y, z, w) {
        return QuatUtils.set(this, ...arguments);
    };

    quatExtension.quat_normalize = function quat_normalize(out = QuatUtils.create()) {
        return QuatUtils.normalize(this, ...arguments);
    };

    quatExtension.quat_copy = function quat_copy(quat) {
        return QuatUtils.copy(quat, this);
    };

    quatExtension.quat_clone = function quat_clone(out = QuatUtils.create()) {
        return QuatUtils.clone(this, ...arguments);
    };

    quatExtension.quat_identity = function quat_identity() {
        return QuatUtils.identity(this, ...arguments);
    };

    quatExtension.quat_length = function quat_length() {
        return QuatUtils.length(this, ...arguments);
    };

    quatExtension.quat_lengthSquared = function quat_lengthSquared() {
        return QuatUtils.lengthSquared(this, ...arguments);
    };

    quatExtension.quat_invert = function quat_invert(out = QuatUtils.create()) {
        return QuatUtils.invert(this, ...arguments);
    };

    quatExtension.quat_conjugate = function quat_conjugate(out = QuatUtils.create()) {
        return QuatUtils.conjugate(this, ...arguments);
    };

    quatExtension.quat_mul = function quat_mul(rotation, out = QuatUtils.create()) {
        return QuatUtils.mul(this, ...arguments);
    };

    quatExtension.quat_getAxis = function quat_getAxis(out = Vec3Utils.create()) {
        return QuatUtils.getAxis(this, ...arguments);
    };

    quatExtension.quat_getAngle = function quat_getAngle() {
        return QuatUtils.getAngle(this, ...arguments);
    };

    quatExtension.quat_getAngleDegrees = function quat_getAngleDegrees() {
        return QuatUtils.getAngleDegrees(this, ...arguments);
    };

    quatExtension.quat_getAngleRadians = function quat_getAngleRadians() {
        return QuatUtils.getAngleRadians(this, ...arguments);
    };

    quatExtension.quat_getAxisScaled = function quat_getAxisScaled(out = Vec3Utils.create()) {
        return QuatUtils.getAxisScaled(this, ...arguments);
    };

    quatExtension.quat_getAxisScaledDegrees = function quat_getAxisScaledDegrees(out = Vec3Utils.create()) {
        return QuatUtils.getAxisScaledDegrees(this, ...arguments);
    };

    quatExtension.quat_getAxisScaledRadians = function quat_getAxisScaledRadians(out = Vec3Utils.create()) {
        return QuatUtils.getAxisScaledRadians(this, ...arguments);
    };

    quatExtension.quat_getAxes = function quat_getAxes(out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
        return QuatUtils.getAxes(this, ...arguments);
    };

    quatExtension.quat_getForward = function quat_getForward(out = Vec3Utils.create()) {
        return QuatUtils.getForward(this, ...arguments);
    };

    quatExtension.quat_getBackward = function quat_getBackward(out) {
        return QuatUtils.getBackward(this, ...arguments);
    };

    quatExtension.quat_getLeft = function quat_getLeft(out = Vec3Utils.create()) {
        return QuatUtils.getLeft(this, ...arguments);
    };

    quatExtension.quat_getRight = function quat_getRight(out) {
        return QuatUtils.getRight(this, ...arguments);
    };

    quatExtension.quat_getUp = function quat_getUp(out = Vec3Utils.create()) {
        return QuatUtils.getUp(this, ...arguments);
    };

    quatExtension.quat_getDown = function quat_getDown(out) {
        return QuatUtils.getDown(this, ...arguments);
    };

    quatExtension.quat_setAxes = function quat_setAxes(left, up, forward) {
        return QuatUtils.setAxes(this, ...arguments);
    };

    quatExtension.quat_setForward = function quat_setForward(forward, up = null, left = null) {
        return QuatUtils.setForward(this, ...arguments);
    };

    quatExtension.quat_setBackward = function quat_setBackward(backward, up = null, left = null) {
        return QuatUtils.setBackward(this, ...arguments);
    };

    quatExtension.quat_setUp = function quat_setUp(up, forward = null, left = null) {
        return QuatUtils.setUp(this, ...arguments);
    };

    quatExtension.quat_setDown = function quat_setDown(down, forward = null, left = null) {
        return QuatUtils.setDown(this, ...arguments);
    };

    quatExtension.quat_setLeft = function quat_setLeft(left, up = null, forward = null) {
        return QuatUtils.setLeft(this, ...arguments);
    };

    quatExtension.quat_setRight = function quat_setRight(right, up = null, forward = null) {
        return QuatUtils.setRight(this, ...arguments);
    };

    quatExtension.quat_toWorld = function quat_toWorld(parentQuat, out = QuatUtils.create()) {
        return QuatUtils.toWorld(this, ...arguments);
    };

    quatExtension.quat_toLocal = function quat_toLocal(parentQuat, out = QuatUtils.create()) {
        return QuatUtils.toLocal(this, ...arguments);
    };

    quatExtension.quat_fromAxis = function quat_fromAxis(angle, axis) {
        return QuatUtils.fromAxis(angle, axis, this);
    };

    quatExtension.quat_fromAxisDegrees = function quat_fromAxisDegrees(angle, axis) {
        return QuatUtils.fromAxisDegrees(angle, axis, this);
    };

    quatExtension.quat_fromAxisRadians = function quat_fromAxisRadians(angle, axis) {
        return QuatUtils.fromAxisRadians(angle, axis, this);
    };

    quatExtension.quat_fromAxes = function quat_fromAxes(leftAxis, upAxis, forwardAxis) {
        return QuatUtils.fromAxes(leftAxis, upAxis, forwardAxis, this);
    };

    // New Functions

    quatExtension.quat_fromRadians = function quat_fromRadians(radiansRotation) {
        return QuatUtils.fromRadians(radiansRotation, this);
    };

    quatExtension.quat_fromDegrees = function quat_fromDegrees(degreesRotation) {
        return QuatUtils.fromDegrees(degreesRotation, this);
    };

    quatExtension.quat_toRadians = function quat_toRadians(out = Vec3Utils.create()) {
        return QuatUtils.toRadians(this, ...arguments);
    };

    quatExtension.quat_toDegrees = function quat_toDegrees(out = Vec3Utils.create()) {
        return QuatUtils.toDegrees(this, ...arguments);
    };

    quatExtension.quat_isNormalized = function quat_isNormalized(epsilon = MathUtils.EPSILON) {
        return QuatUtils.isNormalized(this, ...arguments);
    };

    quatExtension.quat_addRotation = function quat_addRotation(rotation, out) {
        return QuatUtils.addRotation(this, ...arguments);
    };

    quatExtension.quat_addRotationDegrees = function quat_addRotationDegrees(rotation, out) {
        return QuatUtils.addRotationDegrees(this, ...arguments);
    };

    quatExtension.quat_addRotationRadians = function quat_addRotationRadians(rotation, out) {
        return QuatUtils.addRotationRadians(this, ...arguments);
    };

    quatExtension.quat_addRotationQuat = function quat_addRotationQuat(rotation, out = QuatUtils.create()) {
        return QuatUtils.addRotationQuat(this, ...arguments);
    };

    quatExtension.quat_subRotation = function quat_subRotation(rotation, out) {
        return QuatUtils.subRotation(this, ...arguments);
    };

    quatExtension.quat_subRotationDegrees = function quat_subRotationDegrees(rotation, out) {
        return QuatUtils.subRotationDegrees(this, ...arguments);
    };

    quatExtension.quat_subRotationRadians = function quat_subRotationRadians(rotation, out) {
        return QuatUtils.subRotationRadians(this, ...arguments);
    };

    quatExtension.quat_subRotationQuat = function quat_subRotationQuat(rotation, out = QuatUtils.create()) {
        return QuatUtils.subRotationQuat(this, ...arguments);
    };

    quatExtension.quat_rotationTo = function quat_rotationTo(rotation, out) {
        return QuatUtils.rotationTo(this, ...arguments);
    };

    quatExtension.quat_rotationToDegrees = function quat_rotationToDegrees(rotation, out) {
        return QuatUtils.rotationToDegrees(this, ...arguments);
    };

    quatExtension.quat_rotationToRadians = function quat_rotationToRadians(rotation, out) {
        return QuatUtils.rotationToRadians(this, ...arguments);
    };

    quatExtension.quat_rotationToQuat = function quat_rotationToQuat(rotation, out) {
        return QuatUtils.rotationToQuat(this, ...arguments);
    };

    quatExtension.quat_getTwist = function quat_getTwist(axis, out = QuatUtils.create()) {
        return QuatUtils.getTwist(this, ...arguments);
    };

    quatExtension.quat_getSwing = function quat_getSwing(axis, out = QuatUtils.create()) {
        return QuatUtils.getSwing(this, ...arguments);
    };

    quatExtension.quat_getSwingFromTwist = function quat_getSwingFromTwist(twist, out = QuatUtils.create()) {
        return QuatUtils.getSwingFromTwist(this, ...arguments);
    };

    quatExtension.quat_getTwistFromSwing = function quat_getTwistFromSwing(swing, out = QuatUtils.create()) {
        return QuatUtils.getTwistFromSwing(this, ...arguments);
    };

    quatExtension.quat_fromTwistSwing = function quat_fromTwistSwing(twist, swing) {
        return QuatUtils.fromTwistSwing(twist, swing, this);
    };

    quatExtension.quat_toMatrix = function quat_toMatrix(out = Mat3Utils.create()) {
        return QuatUtils.toMatrix(this, ...arguments);
    };

    quatExtension.quat_rotate = function quat_rotate(rotation, out) {
        return QuatUtils.rotate(this, ...arguments);
    };

    quatExtension.quat_rotateDegrees = function quat_rotateDegrees(rotation, out) {
        return QuatUtils.rotateDegrees(this, ...arguments);
    };

    quatExtension.quat_rotateRadians = function quat_rotateRadians(rotation, out) {
        return QuatUtils.rotateRadians(this, ...arguments);
    };

    quatExtension.quat_rotateQuat = function quat_rotateQuat(rotation, out) {
        return QuatUtils.rotateQuat(this, ...arguments);
    };

    quatExtension.quat_rotateAxis = function quat_rotateAxis(angle, axis, out) {
        return QuatUtils.rotateAxis(this, ...arguments);
    };

    quatExtension.quat_rotateAxisDegrees = function quat_rotateAxisDegrees(angle, axis, out) {
        return QuatUtils.rotateAxisDegrees(this, ...arguments);
    };

    quatExtension.quat_rotateAxisRadians = function quat_rotateAxisRadians(angle, axis, out) {
        return QuatUtils.rotateAxisRadians(this, ...arguments);
    };

    quatExtension.quat_lerp = function quat_lerp(to, interpolationValue, out = QuatUtils.create()) {
        return QuatUtils.lerp(this, ...arguments);
    };

    quatExtension.quat_interpolate = function quat_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = QuatUtils.create()) {
        return QuatUtils.interpolate(this, ...arguments);
    };

    quatExtension.quat_slerp = function quat_slerp(to, interpolationValue, out = QuatUtils.create()) {
        return QuatUtils.slerp(this, ...arguments);
    };

    quatExtension.quat_sinterpolate = function quat_sinterpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = QuatUtils.create()) {
        return QuatUtils.sinterpolate(this, ...arguments);
    };

    // QUAT 2

    let quat2Extension = {};

    // glMatrix Bridge

    quat2Extension.quat2_set = function quat2_set(x1, y1, z1, w1, x2, y2, z2, w2) {
        return Quat2Utils.set(this, ...arguments);
    };

    quat2Extension.quat2_normalize = function quat2_normalize(out = Quat2Utils.create()) {
        return Quat2Utils.normalize(this, ...arguments);
    };

    quat2Extension.quat2_invert = function quat2_invert(out = Quat2Utils.create()) {
        return Quat2Utils.invert(this, ...arguments);
    };

    quat2Extension.quat2_conjugate = function quat2_conjugate(out = Quat2Utils.create()) {
        return Quat2Utils.conjugate(this, ...arguments);
    };

    quat2Extension.quat2_copy = function quat2_copy(quat) {
        return Quat2Utils.copy(quat, this);
    };

    quat2Extension.quat2_identity = function quat2_identity() {
        return Quat2Utils.identity(this, ...arguments);
    };

    quat2Extension.quat2_getPosition = function quat2_getPosition(out = Vec3Utils.create()) {
        return Quat2Utils.getPosition(this, ...arguments);
    };

    quat2Extension.quat2_getRotation = function quat2_getRotation(out) {
        return Quat2Utils.getRotation(this, ...arguments);
    };

    quat2Extension.quat2_getRotationDegrees = function quat2_getRotationDegrees(out = Vec3Utils.create()) {
        return Quat2Utils.getRotationDegrees(this, ...arguments);
    };

    quat2Extension.quat2_getRotationRadians = function quat2_getRotationRadians(out = Vec3Utils.create()) {
        return Quat2Utils.getRotationRadians(this, ...arguments);
    };

    quat2Extension.quat2_getRotationQuat = function quat2_getRotationQuat(out = QuatUtils.create()) {
        return Quat2Utils.getRotationQuat(this, ...arguments);
    };

    quat2Extension.quat2_setPosition = function quat2_setPosition(position) {
        return Quat2Utils.setPosition(this, ...arguments);
    };

    quat2Extension.quat2_setRotation = function quat2_setRotation(rotation) {
        return Quat2Utils.setRotation(this, ...arguments);
    };

    quat2Extension.quat2_setRotationDegrees = function quat2_setRotationDegrees(rotation) {
        return Quat2Utils.setRotationDegrees(this, ...arguments);
    };

    quat2Extension.quat2_setRotationRadians = function quat2_setRotationRadians(rotation) {
        return Quat2Utils.setRotationRadians(this, ...arguments);
    };

    quat2Extension.quat2_setRotationQuat = function quat2_setRotationQuat(rotation) {
        return Quat2Utils.setRotationQuat(this, ...arguments);
    };

    quat2Extension.quat2_setPositionRotation = function quat2_setPositionRotation(position, rotation) {
        return Quat2Utils.setPositionRotation(this, ...arguments);
    };

    quat2Extension.quat2_setPositionRotationDegrees = function quat2_setPositionRotationDegrees(position, rotation) {
        return Quat2Utils.setPositionRotationDegrees(this, ...arguments);
    };

    quat2Extension.quat2_setPositionRotationRadians = function quat2_setPositionRotationRadians(position, rotation) {
        return Quat2Utils.setPositionRotationRadians(this, ...arguments);
    };

    quat2Extension.quat2_setPositionRotationQuat = function quat2_setPositionRotationQuat(position, rotation) {
        return Quat2Utils.setPositionRotationQuat(this, ...arguments);
    };

    // New Functions

    quat2Extension.quat2_isNormalized = function quat2_isNormalized(epsilon = MathUtils.EPSILON) {
        return Quat2Utils.isNormalized(this, ...arguments);
    };

    quat2Extension.quat2_length = function quat2_length() {
        return Quat2Utils.length(this, ...arguments);
    };

    quat2Extension.quat2_lengthSquared = function quat2_lengthSquared() {
        return Quat2Utils.lengthSquared(this, ...arguments);
    };

    quat2Extension.quat2_mul = function quat2_mul(quat, out = Quat2Utils.create()) {
        return Quat2Utils.mul(this, ...arguments);
    };

    quat2Extension.quat2_getAxes = function quat2_getAxes(out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
        return Quat2Utils.getAxes(this, ...arguments);
    };

    quat2Extension.quat2_getForward = function quat2_getForward(out = Vec3Utils.create()) {
        return Quat2Utils.getForward(this, ...arguments);
    };

    quat2Extension.quat2_getBackward = function quat2_getBackward(out) {
        return Quat2Utils.getBackward(this, ...arguments);
    };

    quat2Extension.quat2_getLeft = function quat2_getLeft(out = Vec3Utils.create()) {
        return Quat2Utils.getLeft(this, ...arguments);
    };

    quat2Extension.quat2_getRight = function quat2_getRight(out) {
        return Quat2Utils.getRight(this, ...arguments);
    };

    quat2Extension.quat2_getUp = function quat2_getUp(out = Vec3Utils.create()) {
        return Quat2Utils.getUp(this, ...arguments);
    };

    quat2Extension.quat2_getDown = function quat2_getDown(out) {
        return Quat2Utils.getDown(this, ...arguments);
    };

    quat2Extension.quat2_toWorld = function quat2_toWorld(parentTransformQuat, out = Quat2Utils.create()) {
        return Quat2Utils.toWorld(this, ...arguments);
    };

    quat2Extension.quat2_toLocal = function quat2_toLocal(parentTransformQuat, out = Quat2Utils.create()) {
        return Quat2Utils.toLocal(this, ...arguments);
    };

    quat2Extension.quat2_rotateAxis = function quat2_rotateAxis(angle, axis, out) {
        return Quat2Utils.rotateAxis(this, ...arguments);
    };

    quat2Extension.quat2_rotateAxisDegrees = function quat2_rotateAxisDegrees(angle, axis, out) {
        return Quat2Utils.rotateAxisDegrees(this, ...arguments);
    };

    quat2Extension.quat2_rotateAxisRadians = function quat2_rotateAxisRadians(angle, axis, out) {
        return Quat2Utils.rotateAxisRadians(this, ...arguments);
    };

    quat2Extension.quat2_toMatrix = function quat2_toMatrix(out = Mat4Utils.create()) {
        return Quat2Utils.toMatrix(this, ...arguments);
    };

    quat2Extension.quat2_fromMatrix = function quat2_fromMatrix(matrix) {
        return Quat2Utils.fromMatrix(matrix, this);
    };

    quat2Extension.quat2_lerp = function quat2_lerp(to, interpolationValue, out = Quat2Utils.create()) {
        return Quat2Utils.lerp(this, ...arguments);
    };

    quat2Extension.quat2_interpolate = function quat2_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = Quat2Utils.create()) {
        return Quat2Utils.interpolate(this, ...arguments);
    };

    // MATRIX 3

    let mat3Extension = {};

    // glMatrix Bridge

    mat3Extension.mat3_set = function mat3_set(
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22) {
        return Mat3Utils.set(this, ...arguments);
    };

    // New Functions

    mat3Extension.mat3_toDegrees = function mat3_toDegrees(out = Vec3Utils.create()) {
        return Mat3Utils.toDegrees(this, ...arguments);
    };

    mat3Extension.mat3_toRadians = function mat3_toRadians(out = Vec3Utils.create()) {
        return Mat3Utils.toRadians(this, ...arguments);
    };

    mat3Extension.mat3_toQuat = function mat3_toQuat(out = QuatUtils.create()) {
        return Mat3Utils.toQuat(this, ...arguments);
    };
    mat3Extension.mat3_fromAxes = function mat3_fromAxes(leftAxis, upAxis, forwardAxis) {
        return Mat3Utils.fromAxes(leftAxis, upAxis, forwardAxis, this);
    };

    // MATRIX 4

    let mat4Extension = {};

    // glMatrix Bridge

    mat4Extension.mat4_set = function mat4_set(
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33) {
        return Mat4Utils.set(this, ...arguments);
    };

    mat4Extension.mat4_copy = function mat4_copy(matrix) {
        return Mat4Utils.copy(matrix, this);
    };

    mat4Extension.mat4_identity = function mat4_identity() {
        return Mat4Utils.identity(this, ...arguments);
    };

    mat4Extension.mat4_invert = function mat4_invert(out = Mat4Utils.create()) {
        return Mat4Utils.invert(this, ...arguments);
    };

    mat4Extension.mat4_mul = function mat4_mul(matrix, out = Mat4Utils.create()) {
        return Mat4Utils.mul(this, ...arguments);
    };

    mat4Extension.mat4_scale = function mat4_scale(vector, out = Mat4Utils.create()) {
        return Mat4Utils.scale(this, ...arguments);
    };

    mat4Extension.mat4_clone = function mat4_clone(out = Mat4Utils.create()) {
        return Mat4Utils.clone(this, ...arguments);
    };

    mat4Extension.mat4_getPosition = function mat4_getPosition(out = Vec3Utils.create()) {
        return Mat4Utils.getPosition(this, ...arguments);
    };

    mat4Extension.mat4_getRotation = function mat4_getRotation(out = Vec3Utils.create()) {
        return Mat4Utils.getRotation(this, ...arguments);
    };

    mat4Extension.mat4_getRotationDegrees = function mat4_getRotationDegrees(out = Vec3Utils.create()) {
        return Mat4Utils.getRotationDegrees(this, ...arguments);
    };

    mat4Extension.mat4_getRotationRadians = function mat4_getRotationRadians(out = Vec3Utils.create()) {
        return Mat4Utils.getRotationRadians(this, ...arguments);
    };

    mat4Extension.mat4_getRotationQuat = function mat4_getRotationQuat(out = QuatUtils.create()) {
        return Mat4Utils.getRotationQuat(this, ...arguments);
    };

    mat4Extension.mat4_getScale = function mat4_getScale(out = Vec3Utils.create()) {
        return Mat4Utils.getScale(this, ...arguments);
    };

    // New Functions

    mat4Extension.mat4_setPosition = function mat4_setPosition(position) {
        return Mat4Utils.setPosition(this, ...arguments);
    };

    mat4Extension.mat4_setRotation = function mat4_setRotation(rotation) {
        return Mat4Utils.setRotation(this, ...arguments);
    };

    mat4Extension.mat4_setRotationDegrees = function mat4_setRotationDegrees(rotation) {
        return Mat4Utils.setRotationDegrees(this, ...arguments);
    };

    mat4Extension.mat4_setRotationRadians = function mat4_setRotationRadians(rotation) {
        return Mat4Utils.setRotationRadians(this, ...arguments);
    };

    mat4Extension.mat4_setRotationQuat = function mat4_setRotationQuat(rotation) {
        return Mat4Utils.setRotationQuat(this, ...arguments);
    };

    mat4Extension.mat4_setScale = function mat4_setScale(scale) {
        return Mat4Utils.setScale(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationScale = function mat4_setPositionRotationScale(position, rotation, scale) {
        return Mat4Utils.setPositionRotationScale(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationDegreesScale = function mat4_setPositionRotationDegreesScale(position, rotation, scale) {
        return Mat4Utils.setPositionRotationDegreesScale(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationRadiansScale = function mat4_setPositionRotationRadiansScale(position, rotation, scale) {
        return Mat4Utils.setPositionRotationRadiansScale(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationQuatScale = function mat4_setPositionRotationQuatScale(position, rotation, scale) {
        return Mat4Utils.setPositionRotationQuatScale(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotation = function mat4_setPositionRotation(position, rotation) {
        return Mat4Utils.setPositionRotation(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationDegrees = function mat4_setPositionRotationDegrees(position, rotation) {
        return Mat4Utils.setPositionRotationDegrees(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationRadians = function mat4_setPositionRotationRadians(position, rotation) {
        return Mat4Utils.setPositionRotationRadians(this, ...arguments);
    };

    mat4Extension.mat4_setPositionRotationQuat = function mat4_setPositionRotationQuat(position, rotation) {
        return Mat4Utils.setPositionRotationQuat(this, ...arguments);
    };

    mat4Extension.mat4_getAxes = function mat4_getAxes(out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
        return Mat4Utils.getAxes(this, ...arguments);
    };

    mat4Extension.mat4_getForward = function mat4_getForward(out = Vec3Utils.create()) {
        return Mat4Utils.getForward(this, ...arguments);
    };

    mat4Extension.mat4_getBackward = function mat4_getBackward(out) {
        return Mat4Utils.getBackward(this, ...arguments);
    };

    mat4Extension.mat4_getLeft = function mat4_getLeft(out = Vec3Utils.create()) {
        return Mat4Utils.getLeft(this, ...arguments);
    };

    mat4Extension.mat4_getRight = function mat4_getRight(out) {
        return Mat4Utils.getRight(this, ...arguments);
    };

    mat4Extension.mat4_getUp = function mat4_getUp(out = Vec3Utils.create()) {
        return Mat4Utils.getUp(this, ...arguments);
    };

    mat4Extension.mat4_getDown = function mat4_getDown(out) {
        return Mat4Utils.getDown(this, ...arguments);
    };

    mat4Extension.mat4_toWorld = function mat4_toWorld(parentTransformMatrix, out = Mat4Utils.create()) {
        return Mat4Utils.toWorld(this, ...arguments);
    };

    mat4Extension.mat4_toLocal = function mat4_toLocal(parentTransformMatrix, out = Mat4Utils.create()) {
        return Mat4Utils.toLocal(this, ...arguments);
    };

    mat4Extension.mat4_hasUniformScale = function mat4_hasUniformScale() {
        return Mat4Utils.hasUniformScale(this, ...arguments);
    };

    mat4Extension.mat4_toQuat = function mat4_toQuat(out = Quat2Utils.create()) {
        return Mat4Utils.toQuat(this, ...arguments);
    };

    mat4Extension.mat4_fromQuat = function mat4_fromQuat(quat) {
        return Mat4Utils.fromQuat(quat, this);
    };



    let arrayPrototypesToExtend = [
        Array.prototype, Uint8ClampedArray.prototype, Uint8Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Int8Array.prototype,
        Int16Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype];

    for (let arrayPrototypeToExtend of arrayPrototypesToExtend) {
        PluginUtils.injectProperties(arrayExtension, arrayPrototypeToExtend, false, true, true);

        PluginUtils.injectProperties(vecExtension, arrayPrototypeToExtend, false, true, true);

        PluginUtils.injectProperties(vec2Extension, arrayPrototypeToExtend, false, true, true);
        PluginUtils.injectProperties(vec3Extension, arrayPrototypeToExtend, false, true, true);
        PluginUtils.injectProperties(vec4Extension, arrayPrototypeToExtend, false, true, true);

        PluginUtils.injectProperties(quatExtension, arrayPrototypeToExtend, false, true, true);
        PluginUtils.injectProperties(quat2Extension, arrayPrototypeToExtend, false, true, true);

        PluginUtils.injectProperties(mat3Extension, arrayPrototypeToExtend, false, true, true);
        PluginUtils.injectProperties(mat4Extension, arrayPrototypeToExtend, false, true, true);

        PluginUtils.injectProperties(arrayExtension, arrayPrototypeToExtend, false, true, true);
    }
}