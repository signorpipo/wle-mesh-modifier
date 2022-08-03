PP.PhysicsLayerFlags = class PhysicsLayerFlags {
    constructor() {
        this._myLayerMask = 0;
    }

    setFlagActive(indexOrName, active) {
        let index = indexOrName;
        if (isNaN(indexOrName)) {
            index = PP.PhysicsUtils.getLayerFlagNames().pp_findIndexEqual(indexOrName);
        }

        if (index >= 0 && index < PP.PhysicsUtils.getLayerFlagAmount()) {
            let mask = 1 << index;

            if (active) {
                this._myLayerMask = this._myLayerMask | mask;
            } else {
                this._myLayerMask = this._myLayerMask & ~mask;
            }
        }
    }

    isFlagActive(indexOrName) {
        let index = indexOrName;
        if (isNaN(indexOrName)) {
            index = PP.PhysicsUtils.getLayerFlagNames().pp_findIndexEqual(indexOrName);
        }

        let isActive = false;

        if (index >= 0 && index < PP.PhysicsUtils.getLayerFlagAmount()) {
            let mask = 1 << index;
            isActive = !!(this._myLayerMask & mask);
        }

        return isActive;
    }

    setAllFlagsActive(active) {
        if (!active) {
            this._myLayerMask = 0;
        } else {
            this._myLayerMask = Math.pow(2, PP.PhysicsUtils.getLayerFlagAmount()) - 1;
        }
    }

    getMask() {
        return this._myLayerMask;
    }

    setMask(layerMask) {
        this._myLayerMask = layerMask;
    }

    copy(layerFlags) {
        this._myLayerMask = layerFlags._myLayerMask;
    }
};