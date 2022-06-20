randomColor = function (seed) {
    let r = randomFromSeed(seed);
    let g = randomFromSeed(Math.round(r * Number.MAX_SAFE_INTEGER));
    let b = randomFromSeed(Math.round(g * Number.MAX_SAFE_INTEGER));

    return [r, g, b, 1];
};

randomFromSeed = function (seed) {
    var t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

jsonStringify = function (object) {
    return JSON.stringify(object, _jsonReplacer);
};

jsonParse = function (json) {
    return JSON.parse(json, _jsonReviver);
};

function _jsonReplacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function _jsonReviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}