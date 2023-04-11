import { Component } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array_extension";
import { getDefaultMaterials } from "../../../pp/default_resources_globals";
import { getVisualManager, getVisualResources, hasVisualManager, hasVisualResources, removeVisualManager, removeVisualResources, setVisualManager, setVisualResources } from "../visual_globals";
import { VisualManager } from "../visual_manager";
import { VisualResources } from "../visual_resources";

export class VisualManagerComponent extends Component {
    static TypeName = "pp-visual-manager";
    static Properties = {};

    init() {
        this._myVisualManager = null;

        // Prevents double global from same engine
        if (!hasVisualManager(this.engine)) {
            this._myVisualManager = new VisualManager(this.engine);

            setVisualManager(this._myVisualManager, this.engine);
        }

        // Prevents double global from same engine
        if (!hasVisualResources(this.engine)) {
            this._myVisualResources = new VisualResources();

            setVisualResources(this._myVisualResources, this.engine);
        }
    }

    start() {
        if (this._myVisualResources != null) {
            this._myVisualResources.myDefaultMaterials.myMesh = getDefaultMaterials(this.engine).myFlatOpaque.clone();

            this._myVisualResources.myDefaultMaterials.myText = getDefaultMaterials(this.engine).myText.clone();

            this._myVisualResources.myDefaultMaterials.myRight = getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myRight.color = vec4_create(1, 0, 0, 1);
            this._myVisualResources.myDefaultMaterials.myUp = getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myUp.color = vec4_create(0, 1, 0, 1);
            this._myVisualResources.myDefaultMaterials.myForward = getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myForward.color = vec4_create(0, 0, 1, 1);

            this._myVisualResources.myDefaultMaterials.myRay = getDefaultMaterials(this.engine).myFlatOpaque.clone();
            this._myVisualResources.myDefaultMaterials.myRay.color = vec4_create(0, 1, 0, 1);
            this._myVisualResources.myDefaultMaterials.myHitNormal = getDefaultMaterials(this.engine).myFlatOpaque.clone();
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
        if (this._myVisualManager != null && getVisualManager(this.engine) == this._myVisualManager) {
            removeVisualManager(this.engine);
        }

        if (this._myVisualResources != null && getVisualResources(this.engine) == this._myVisualResources) {
            removeVisualResources(this.engine);
        }
    }
}