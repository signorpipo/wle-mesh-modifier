import { Component, MeshComponent, Property } from "@wonderlandengine/api";
import { loadVariantSetup } from "./load_variants";
import { MeshVariantSetup } from "./vertex_group_config";

export class LoadVariantComponent extends Component {
    static TypeName = "load-variant";
    static Properties = {
        _myMeshObject: Property.object(),
        _myShadeType: Property.enum(["flat", "smooth"], "flat"),
        _myVertexGroupConfigPath: Property.string(),
        _myVariantSetup: Property.string("")
    };

    start() {
        let meshComponent = this._myMeshObject.pp_getComponent(MeshComponent);

        let variantSetupArray = JSON.parse(this._myVariantSetup);
        let meshVariantSetup = new MeshVariantSetup();
        if (variantSetupArray.length != null) {
            for (let variantSetup of variantSetupArray) {
                meshVariantSetup.setGroupVariant(variantSetup[0], variantSetup[1]);
            }
        }

        loadVariantSetup(meshComponent, this._myVertexGroupConfigPath, meshVariantSetup, this._myShadeType == 0);
    }
}