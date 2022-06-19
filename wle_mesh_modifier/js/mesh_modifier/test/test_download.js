WL.registerComponent("test-download", {

}, {
    init: function () {

    },
    start: function () {

    },
    update: function (dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileText("test.txt", "Provissima perché si");
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileJSON("test.json", this);
        }
    },
});