import { Component, Property } from "@wonderlandengine/api";

export class TestSetAxisComponent extends Component {
    static TypeName = "test-set-axis";
    static Properties = {

    };

    init() {

    }

    start() {
        this.object.pp_addComponent("pp-debug-transform");
    }

    update(dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd()) {
            let handPosition = PP.myLeftGamepad.getHandPose().getPosition();
            let direction = handPosition.vec3_sub(this.object.pp_getPosition());

            //direction = this.object.pp_convertDirectionWorldToLocal(direction);

            PP.myDebugVisualManager.drawArrow(0, this.object.pp_getPosition(), direction, 0.1);

            this.object.pp_setForwardWorld(direction, [0, 1, 0], [-1, 0, 0]);
            this.object.pp_setAxesWorld(this.object.pp_getLeftWorld(), this.object.pp_getUpWorld(), this.object.pp_getForwardWorld());
        }
    }
}