WL.registerComponent("log-object", {

}, {
    init: function () {

    },
    start: function () {
        console.error(this.object.pp_toString());
    },
    update: function (dt) {
    },
});