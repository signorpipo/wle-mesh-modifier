import { Component } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { VisualManager } from "../visual_manager";
import { VisualResources } from "../visual_resources";

export class VisualManagerComponent extends Component {
    static TypeName = "pp-visual-manager";
    static Properties = {};

    init() {
        this._myVisualManager = null;

        // Prevents double global from same engine
        if (!Globals.hasVisualManager(this.engine)) {
            this._myVisualManager = new VisualManager(this.engine);

            Globals.setVisualManager(this._myVisualManager, this.engine);
        }

        // Prevents double global from same engine
        if (!Globals.hasVisualResources(this.engine)) {
            this._myVisualResources = new VisualResources();

            Globals.setVisualResources(this._myVisualResources, this.engine);
        }
    }

    start() {
        if (this._myVisualResources != null) {
            this._myVisualResources.myDefaultMaterials.myMesh = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();

            this._myVisualResources.myDefaultMaterials.myText = Globals.getDefaultMaterials(this.engine).myText.clone();

            this._myVisualResources.myDefaultMaterials.myRight = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myRight.color = vec4_create(1, 0, 0, 1);
            this._myVisualResources.myDefaultMaterials.myUp = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myUp.color = vec4_create(0, 1, 0, 1);
            this._myVisualResources.myDefaultMaterials.myForward = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myForward.color = vec4_create(0, 0, 1, 1);

            this._myVisualResources.myDefaultMaterials.myRay = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myRay.color = vec4_create(0, 1, 0, 1);
            this._myVisualResources.myDefaultMaterials.myHitNormal = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myHitNormal.color = vec4_create(1, 0, 0, 1);
        }

        if (this.myVisualManager != null) {
            this.myVisualManager.start();
        }
    }

    update(dt) {
        if (this.myVisualManager != null) {
            this.myVisualManager.update(dt);
        }
    }

    onDestroy() {
        if (this._myVisualManager != null && Globals.getVisualManager(this.engine) == this._myVisualManager) {
            Globals.removeVisualManager(this.engine);

            this._myVisualManager.destroy();
        }

        if (this._myVisualResources != null && Globals.getVisualResources(this.engine) == this._myVisualResources) {
            Globals.removeVisualResources(this.engine);
        }
    }
}