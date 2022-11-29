WL.registerComponent("remap-group", {
    _myFromMeshObject: { type: WL.Type.Object },
    _myFromMeshFilePath: { type: WL.Type.String },
    _myFromMeshVertexGroupConfigPath: { type: WL.Type.String },
    _myToMeshObject: { type: WL.Type.Object },
    _myToMeshFilePath: { type: WL.Type.String },
    _myTransformObject: { type: WL.Type.Object },
    _myEnableDownload: { type: WL.Type.Bool, default: false },
}, {
    start: function () {
        this._myConverted = false;

        this._myFromMesh = null;
        this._myToMesh = null;

        this._myFromVertexGroupConfig = null;

        if (this._myFromMeshObject == null) {
            WL.scene.append(this._myFromMeshFilePath).then(function (meshObject) {
                this._myFromMesh = meshObject.pp_getComponentHierarchy("mesh").mesh;
            }.bind(this));
        } else {
            this._myFromMesh = this._myFromMeshObject.pp_getComponentHierarchy("mesh").mesh;
        }

        if (this._myToMeshObject == null) {
            WL.scene.append(this._myToMeshFilePath).then(function (meshObject) {
                this._myToMesh = meshObject.pp_getComponentHierarchy("mesh").mesh;
            }.bind(this));
        } else {
            this._myToMesh = this._myToMeshObject.pp_getComponentHierarchy("mesh").mesh;
        }

        loadFileText(this._myFromMeshVertexGroupConfigPath,
            function (text) {
                this._myFromVertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
                    this._myFromVertexGroupConfig.fromJSONObject(jsonObject);
                } catch (error) {
                    this._myFromVertexGroupConfig = new VertexGroupConfig();
                }
            }.bind(this),
            function (response) {
                this._myFromVertexGroupConfig = new VertexGroupConfig();
            }.bind(this)
        );
    },
    update(dt) {
        if (!this._myConverted) {
            if (this._myFromMesh != null && this._myToMesh != null && this._myFromVertexGroupConfig != null) {
                let toVertexGroupConfig = this._myFromVertexGroupConfig.remapToMesh(this._myFromMesh, this._myToMesh, (this._myTransformObject != null) ? this._myTransformObject.pp_getTransformLocal() : undefined);

                let configText = jsonStringify(toVertexGroupConfig);

                if (this.myEnableDownload) {
                    downloadFileText("remapped_vertex_group_config.json", configText);
                }

                console.log("Remapped Vertex Group Config:");
                console.log(configText);

                this._myConverted = true;
            }
        }
    }
});