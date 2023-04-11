import { Component } from "@wonderlandengine/api";
import { GamepadButtonID, getRightGamepad } from "../../pp";
import { downloadFileJSON, downloadFileText } from "../file_manager";

export class TestDownloadComponent extends Component {
    static TypeName = "test-download";
    static Properties = {

    };

    init() {

    }

    start() {

    }

    update(dt) {
        if (getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd()) {
            downloadFileText("./tests/test.txt", "Super Attempt Because Yes");
        }

        if (getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd()) {
            downloadFileJSON("./tests/test.json", this);
        }
    }
}