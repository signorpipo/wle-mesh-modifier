WL.registerComponent("test-set-axis", {

}, {
    init: function () {

    },
    start: function () {
        this.object.pp_addComponent("pp-debug-transform");
    },
    update: function (dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            let handPosition = PP.myLeftGamepad.getHandPose().getPosition();
            let direction = handPosition.vec3_sub(this.object.pp_getPosition());

            //direction = this.object.pp_convertDirectionWorldToLocal(direction);

            let debugDrawParams = new PP.DebugArrowParams();
            debugDrawParams.myStart = this.object.pp_getPosition();
            debugDrawParams.myDirection = direction;
            debugDrawParams.myLength = 0.1;
            PP.myDebugManager.draw(debugDrawParams, 1);

            this.object.pp_setForwardWorld(direction, [0, 1, 0], [-1, 0, 0]);
            this.object.pp_setAxesWorld(this.object.pp_getLeftWorld(), this.object.pp_getUpWorld(), this.object.pp_getForwardWorld());
        }
    },
});