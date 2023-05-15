import { EasingFunction } from "../../../cauldron/js/utils/math_utils";

// You can just put startNumber if u want a number that doesn't actually change -> new NumberOverValue(0)
export class NumberOverValue {

    constructor(startNumber, endNumber = null, startInterpolationValue = 0, endInterpolationValue = 0, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (endNumber == null) {
            endNumber = startNumber;
        }

        this._myStartNumber = startNumber;
        this._myEndNumber = endNumber;

        this._myStartInterpolationValue = startInterpolationValue;
        this._myEndInterpolationValue = endInterpolationValue;

        this._myEasingFunction = easingFunction;
        this._myRoundingFunction = roundingFunction; // Signature: function(numberToRound, startNumber = null, endNumber = null) -> int, Math.round/floor/ceil can be used
    }

    get(interpolationValue) {
        let lerpInterpolationValue = this._myEasingFunction(Math.pp_mapToRange(interpolationValue, this._myStartInterpolationValue, this._myEndInterpolationValue, 0, 1));
        let lerpNumber = Math.pp_lerp(this._myStartNumber, this._myEndNumber, lerpInterpolationValue);

        if (this._myRoundingFunction) {
            lerpNumber = this._myRoundingFunction(lerpNumber, this._myStartNumber, this._myEndNumber);
        }

        return lerpNumber;
    }

    getAverage(interpolationValue) {
        return this.get(interpolationValue);
    }

    getRange(interpolationValue) {
        let number = this.get(interpolationValue);
        return [number, number];
    }

    getMax(interpolationValue) {
        return this.get(interpolationValue);
    }

    getMin(interpolationValue) {
        return this.get(interpolationValue);
    }

    isInside(number, interpolationValue) {
        let currentNumber = this.get(interpolationValue);

        return currentNumber == number;
    }

    isInsideAngleRange(number, interpolationValue) {
        return this.isInsideAngleRangeDegrees(number, interpolationValue);
    }

    isInsideAngleRangeDegrees(number, interpolationValue) {
        let currentNumber = this.get(interpolationValue);

        let clampedNumber = Math.pp_angleClampDegrees(number);
        let clampedCurrentNumber = Math.pp_angleClampDegrees(currentNumber);

        return clampedNumber == clampedCurrentNumber;
    }

    isInsideAngleRangeRadians(number, interpolationValue) {
        let currentNumber = this.get(interpolationValue);

        let clampedNumber = Math.pp_angleClampRadians(number);
        let clampedCurrentNumber = Math.pp_angleClampRadians(currentNumber);

        return clampedNumber == clampedCurrentNumber;
    }
}

export class IntOverValue extends NumberOverValue {

    constructor(startNumber, endNumber, startInterpolationValue, endInterpolationValue, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound, startNumber, endNumber) {
                let roundedNumber = null;

                let useFloor = startNumber <= endNumber;
                if (useFloor) {
                    roundedNumber = Math.floor(numberToRound);
                } else {
                    roundedNumber = Math.ceil(numberToRound);
                }

                return roundedNumber;
            };
        }

        super(startNumber, endNumber, startInterpolationValue, endInterpolationValue, easingFunction, roundingFunction);
    }
}

// You can just put startRange if u want a range that doesn't actually change -> new NumberOverValue([1,25])
export class NumberRangeOverValue {

    constructor(startRange, endRange = null, startInterpolationValue = 0, endInterpolationValue = 0, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (endRange == null) {
            endRange = startRange;
        }

        this._myStartNumberOverValue = new NumberOverValue(startRange[0], endRange[0], startInterpolationValue, endInterpolationValue, easingFunction, roundingFunction);
        this._myEndNumberOverValue = new NumberOverValue(startRange[1], endRange[1], startInterpolationValue, endInterpolationValue, easingFunction, roundingFunction);

        this._myRoundingFunction = roundingFunction; // Signature: function(numberToRound, startNumber = null, endNumber = null) -> int, Math.round/floor/ceil can be used
    }

    get(interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        let randomValue = null;

        if (this._myRoundingFunction) {
            randomValue = Math.pp_randomInt(startNumber, endNumber);
        } else {
            randomValue = Math.pp_random(startNumber, endNumber);
        }

        return randomValue;
    }

    getAverage(interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        let average = (startNumber + endNumber) / 2;
        if (this._myRoundingFunction) {
            average = this._myRoundingFunction(average, startNumber, endNumber);
        }

        return average;
    }

    getRange(interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        return [startNumber, endNumber];
    }

    getMax(interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        return Math.max(startNumber, endNumber);
    }

    getMin(interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        return Math.min(startNumber, endNumber);
    }

    isInside(number, interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        let min = Math.min(startNumber, endNumber);
        let max = Math.max(startNumber, endNumber);

        return number >= min && number <= max;
    }

    isInsideAngleRange(number, interpolationValue) {
        return this.isInsideAngleRangeDegrees(number, interpolationValue);
    }

    isInsideAngleRangeDegrees(number, interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        return Math.pp_isInsideAngleRangeDegrees(number, startNumber, endNumber);
    }

    isInsideAngleRangeRadians(number, interpolationValue) {
        let startNumber = this._myStartNumberOverValue.get(interpolationValue);
        let endNumber = this._myEndNumberOverValue.get(interpolationValue);

        return Math.pp_isInsideAngleRangeRadians(number, startNumber, endNumber);
    }
}

export class IntRangeOverValue extends NumberRangeOverValue {

    constructor(startRange, endRange, startInterpolationValue, endInterpolationValue, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound, startNumber, endNumber) {
                let roundedNumber = null;

                let useFloor = startNumber <= endNumber;
                if (useFloor) {
                    roundedNumber = Math.floor(numberToRound);
                } else {
                    roundedNumber = Math.ceil(numberToRound);
                }

                return roundedNumber;
            };
        }

        super(startRange, endRange, startInterpolationValue, endInterpolationValue, easingFunction, roundingFunction);
    }
}