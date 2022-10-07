loadVariantSetup = function loadVariantSetup(meshComponent, vertexGroupConfigPath, meshVariantSetup, isFlatShading) {
    meshComponent.active = false;

    loadFileText(vertexGroupConfigPath,
        function (text) {
            let vertexGroupConfig = new VertexGroupConfig();
            try {
                let jsonObject = jsonParse(text);
                vertexGroupConfig.fromJSONObject(jsonObject);
                vertexGroupConfig.loadVariantSetup(meshComponent.mesh, meshVariantSetup, isFlatShading);

            } catch (error) {
                console.error("error parsing vertex group config:", vertexGroupConfigPath);
                console.error("error:", error);
                console.error("text:", text);
            }

            meshComponent.active = true;
        }.bind(this),
        function (response) {
            console.error("could not load vertex group config:", vertexGroupConfigPath);

            meshComponent.active = true;
        }.bind(this)
    );
};