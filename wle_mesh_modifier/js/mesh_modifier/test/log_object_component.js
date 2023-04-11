import { Component } from "@wonderlandengine/api";

export class LogObjectComponent extends Component {
    static TypeName = "log-object";
    static Properties = {

    };

    init() {

    }

    start() {
        console.error(this.object.pp_toString());
    }

    update(dt) {
    }
}