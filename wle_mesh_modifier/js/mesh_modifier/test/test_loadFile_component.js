import { Component, Property } from "@wonderlandengine/api";

export class TestLoasFileComponent extends Component {
    static TypeName = "test-loadFile";
    static Properties = {
    };

    init() {

    }

    start() {
        this._myData = null;
        this._myLogData = true;

        loadFileJSON("./tests/test_json.json", data => this._myData = data);
    }

    update(dt) {
        if (this._myLogData) {
            if (this._myData != null) {
                console.log(this._myData);
                console.log(JSON.stringify(this._myData));
                this._myLogData = false;
            }
        }
    }
}