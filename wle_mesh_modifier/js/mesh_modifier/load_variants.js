WL.registerComponent("load-variant", {
    _myMeshObject: { type: WL.Type.Object },
    _myShadeType: { type: WL.Type.Enum, values: ['flat', 'smooth'], default: 'flat' },
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myVariantSetup: { type: WL.Type.String, default: '' }
}, {
    start: function () {
        let meshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");
        meshComponent.active = false;

        loadFileText(this._myVertexGroupConfigPath,
            function (text) {
                let vertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
                    vertexGroupConfig.fromJSONObject(jsonObject);

                    this.loadVariantSetup(vertexGroupConfig);
                } catch (error) {
                    console.error("error parsing vertex group config:", this._myVertexGroupConfigPath);
                    console.error("error:", error);
                    console.error("text:", text);
                }
            }.bind(this),
            function (response) {
                console.error("could not load vertex group config:", this._myVertexGroupConfigPath);
            }.bind(this)
        );
    },
    loadVariantSetup(vertexGroupConfig) {
        let meshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");
        let variantSetupArray = JSON.parse(this._myVariantSetup);
        let isFlatShading = this._myShadeType == 0;

        let meshVariantSetup = new MeshVariantSetup();
        if (variantSetupArray.length != null) {
            for (let variantSetup of variantSetupArray) {
                meshVariantSetup.setGroupVariant(variantSetup[0], variantSetup[1]);
            }
        }

        vertexGroupConfig.loadVariantSetup(meshComponent.mesh, meshVariantSetup, isFlatShading);

        meshComponent.active = true;
    }
});