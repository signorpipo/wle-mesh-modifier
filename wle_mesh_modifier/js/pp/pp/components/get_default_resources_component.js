import { Component, Property } from "@wonderlandengine/api";
import { MeshUtils } from "../../cauldron/utils/mesh_utils";
import { DefaultResources } from "../default_resources";
import { Globals } from "../globals";

export class GetDefaultResourcesComponent extends Component {
    static TypeName = "pp-get-default-resources";
    static Properties = {
        _myPlane: Property.mesh(),
        _myCube: Property.mesh(),
        _mySphere: Property.mesh(),
        _myCone: Property.mesh(),
        _myCylinder: Property.mesh(),
        _myCircle: Property.mesh(),

        _myFlatOpaque: Property.material(),
        _myFlatTransparentNoDepth: Property.material(),
        _myPhongOpaque: Property.material(),
        _myText: Property.material()
    };

    init() {
        this._myDefaultResources = null;

        // Prevents double global from same engine
        if (!Globals.hasDefaultResources(this.engine)) {
            this._myDefaultResources = new DefaultResources();
            this._myDefaultResources.myMeshes.myPlane = MeshUtils.clone(this._myPlane);
            this._myDefaultResources.myMeshes.myCube = MeshUtils.clone(this._myCube);
            this._myDefaultResources.myMeshes.mySphere = MeshUtils.clone(this._mySphere);
            this._myDefaultResources.myMeshes.myCone = MeshUtils.clone(this._myCone);
            this._myDefaultResources.myMeshes.myCylinder = MeshUtils.clone(this._myCylinder);
            this._myDefaultResources.myMeshes.myCircle = MeshUtils.clone(this._myCircle);

            this._myDefaultResources.myMeshes.myInvertedCube = MeshUtils.invert(this._myCube);
            this._myDefaultResources.myMeshes.myInvertedSphere = MeshUtils.invert(this._mySphere);
            this._myDefaultResources.myMeshes.myInvertedCone = MeshUtils.invert(this._myCone);
            this._myDefaultResources.myMeshes.myInvertedCylinder = MeshUtils.invert(this._myCylinder);

            if (this._myFlatOpaque != null) {
                this._myDefaultResources.myMaterials.myFlatOpaque = this._myFlatOpaque.clone();
            }

            if (this._myFlatTransparentNoDepth != null) {
                this._myDefaultResources.myMaterials.myFlatTransparentNoDepth = this._myFlatTransparentNoDepth.clone();
            }

            if (this._myPhongOpaque != null) {
                this._myDefaultResources.myMaterials.myPhongOpaque = this._myPhongOpaque.clone();
            }

            if (this._myText != null) {
                this._myDefaultResources.myMaterials.myText = this._myText.clone();
            }

            Globals.setDefaultResources(this._myDefaultResources, this.engine);
        }
    }

    onDestroy() {
        if (this._myDefaultResources != null && Globals.getDefaultResources(this.engine) == this._myDefaultResources) {
            Globals.removeDefaultResources(this.engine);
        }
    }
}