import { Component, Property } from "@wonderlandengine/api";

export class TestDownloadComponent extends Component {
    static TypeName = "test-download";
    static Properties = {

    };

    init() {

    }

    start() {

    }

    update(dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileText("./tests/test.txt", "Super Attempt Because Yes");
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileJSON("./tests/test.json", this);
        }
    }
}