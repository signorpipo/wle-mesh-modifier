WL.registerComponent("test-download", {

}, {
    init: function () {

    },
    start: function () {

    },
    update: function (dt) {
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileText("./tests/test.txt", "Super Attempt Because Yes");
        }

        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd()) {
            downloadFileJSON("./tests/test.json", this);
        }
    },
});