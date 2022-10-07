WL.registerComponent("load-variant", {
    _myMeshObject: { type: WL.Type.Object },
    _myShadeType: { type: WL.Type.Enum, values: ['flat', 'smooth'], default: 'flat' },
    _myVertexGroupConfigPath: { type: WL.Type.String },
    _myVariantSetup: { type: WL.Type.String, default: '' }
}, {
    start: function () {
        let meshComponent = this._myMeshObject.pp_getComponentHierarchy("mesh");

        let variantSetupArray = JSON.parse(this._myVariantSetup);
        let meshVariantSetup = new MeshVariantSetup();
        if (variantSetupArray.length != null) {
            for (let variantSetup of variantSetupArray) {
                meshVariantSetup.setGroupVariant(variantSetup[0], variantSetup[1]);
            }
        }

        loadVariantSetup(meshComponent, this._myVertexGroupConfigPath, meshVariantSetup, this._myShadeType == 0);
    }
});