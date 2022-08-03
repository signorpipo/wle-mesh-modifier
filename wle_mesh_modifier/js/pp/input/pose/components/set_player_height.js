WL.registerComponent("pp-set-player-height", {
    _myEyesHeight: { type: WL.Type.Float, default: 1.65 },
    _mySetOnlyOnce: { type: WL.Type.Bool, default: true }
}, {
    start: function () {
        let localPosition = this.object.pp_getPositionLocal();
        this.object.pp_setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);

        this._myHeightSetOnce = false;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    _onXRSessionStart: function () {
        if (this.active && (!this._mySetOnlyOnce || !this._myHeightSetOnce)) {
            let localPosition = this.object.pp_getPositionLocal();
            if (PP.XRUtils.isReferenceSpaceLocalFloor()) {
                this.object.pp_setPositionLocal([localPosition[0], 0, localPosition[2]]);
            } else if (PP.XRUtils.isDeviceEmulated()) {
                this.object.pp_setPositionLocal([localPosition[0], 0, localPosition[2]]);
            } else {
                this.object.pp_setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);
            }

            this._myHeightSetOnce = true;
        }
    },
    _onXRSessionEnd: function () {
        if (this.active && !this._mySetOnlyOnce) {
            let localPosition = this.object.pp_getPositionLocal();
            this.object.pp_setPositionLocal([localPosition[0], this._myEyesHeight, localPosition[2]]);
        }
    }
});