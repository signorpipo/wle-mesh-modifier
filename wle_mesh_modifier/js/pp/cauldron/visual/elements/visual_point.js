/*
let visualParams = new VisualPointParams();
visualParams.myPosition.vec3_copy(position);
visualParams.myRadius = 0.005;
visualParams.myMaterial = myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
getVisualManager().draw(visualParams);

or

let visualPoint = new VisualPoint(visualParams);
*/

import { MeshComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array_extension";
import { getDefaultMaterials, getDefaultMeshes } from "../../../pp/default_resources_globals";
import { getSceneObjects } from "../../../pp/scene_objects_global";
import { getMainEngine } from "../../wl/engine_globals";
import { getVisualResources } from "../visual_globals";
import { VisualElementType } from "./visual_element_types";

export class VisualPointParams {

    constructor(engine = getMainEngine()) {
        this.myPosition = vec3_create();
        this.myRadius = 0.005;

        this.myMesh = null;         // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.mySphere

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = getSceneObjects(engine).myVisualElements;
        this.myIsLocal = false;

        this.myType = VisualElementType.POINT;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualPoint {

    constructor(params = new VisualPointParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myPointObject = null;
        this._myPointMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myPointObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    copyParams(params) {
        this._myParams.copy(params);
        this._markDirty();
    }

    paramsUpdated() {
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    forceRefresh() {
        this._refresh();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _build() {
        this._myPointObject = getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();

        this._myPointMeshComponent = this._myPointObject.pp_addComponent(MeshComponent);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualPointParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualPoint(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    _refresh() {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

VisualPoint.prototype._refresh = function () {
    let rotation = vec3_create(0, 0, 0);
    return function _refresh() {
        this._myPointObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myIsLocal) {
            this._myPointObject.pp_setPositionLocal(this._myParams.myPosition);
            this._myPointObject.pp_setRotationLocal(rotation);
            this._myPointObject.pp_setScaleLocal(this._myParams.myRadius);
        } else {
            this._myPointObject.pp_setPosition(this._myParams.myPosition);
            this._myPointObject.pp_setRotation(rotation);
            this._myPointObject.pp_setScale(this._myParams.myRadius);
        }

        if (this._myParams.myMesh != null) {
            this._myPointMeshComponent.mesh = this._myParams.myMesh;
        } else {
            this._myPointMeshComponent.mesh = getDefaultMeshes(this._myParams.myParent.pp_getEngine()).mySphere;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myPointMeshComponent.material = getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myFlatOpaque.clone();
                }
                this._myPointMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myPointMeshComponent.material = this._myParams.myMaterial;
        }
    }
}();

VisualPointParams.prototype.copy = function copy(other) {
    this.myPosition.vec3_copy(other.myPosition);
    this.myRadius = other.myRadius;

    this.myMesh = other.myMesh;

    if (other.myMaterial != null) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = null;
    }

    if (other.myColor != null) {
        if (this.myColor != null) {
            this.myColor.vec4_copy(other.myColor);
        } else {
            this.myColor = other.myColor.vec4_clone();
        }
    } else {
        this.myColor = null;
    }

    this.myParent = other.myParent;
    this.myIsLocal = other.myIsLocal;

    this.myType = other.myType;
};