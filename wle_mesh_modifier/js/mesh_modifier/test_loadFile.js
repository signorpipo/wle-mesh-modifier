WL.registerComponent("test-loadFile", {
}, {
    init: function () {

    },
    start: function () {
        this._myData = null;
        this._myLogData = true;

        Global.loadFileJSON('test_json.json', data => this._myData = data);
        /* fetch('test_json.json')
            .then(response => response.json())
            .then(data => {
                this._myData = data;
            }); */
    },
    update: function (dt) {
        if (this._myLogData) {
            if (this._myData != null) {
                console.log(this._myData);
                console.log(JSON.stringify(this._myData));
                this._myLogData = false;
            }
        }
    },
});