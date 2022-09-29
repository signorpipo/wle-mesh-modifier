/*
let visualParams = new PP.VisualTorusParams();
visualParams.myRadius = 1;
visualParams.mySegmentAmount = 12;
visualParams.mySegmentThickness = 0.05;
visualParams.myTransform.mat4_copy(transform);
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = [1, 1, 1, 1];
PP.myVisualManager.draw(visualParams);

or

let visualTorus = new PP.VisualTorus(visualParams);
*/

PP.VisualTorusParams = class VisualTorusParams {

    constructor() {
        this.myRadius = 0;

        this.mySegmentAmount = 12;
        this.mySegmentThickness = 0.05;

        this.myTransform = PP.mat4_create();

        this.myMaterial = null;
        this.myColor = null; // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = null; // if this is set the parent will not be the visual root anymore, the positions will be local to this object

        this.myType = PP.VisualElementType.TORUS;
    }
};

PP.VisualTorus = class VisualTorus {

    constructor(params = new PP.VisualTorusParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myTorusRootObject = null;

        this._myVisualSegmentList = [];

        this._myFlatOpaqueMaterial = null;

        this._build();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;

            if (this._myVisible) {
                let segmentToShow = Math.min(this._myParams.mySegmentAmount, this._myVisualSegmentList.length);

                for (let i = 0; i < segmentToShow; i++) {
                    let visualSegment = this._myVisualSegmentList[i];
                    visualSegment.setVisible(true);
                }
            } else {
                for (let visualSegment of this._myVisualSegmentList) {
                    visualSegment.setVisible(false);
                }
            }
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

    paramsUpdated() {
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    forceRefresh() {
        this._refresh();

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.forceRefresh();
        }
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.update(dt);
        }
    }

    _build() {
        this._myTorusRootObject = WL.scene.addObject(null);

        this._fillSegmentList();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    _fillSegmentList() {
        while (this._myVisualSegmentList.length < this._myParams.mySegmentAmount) {
            let visualSegment = new PP.VisualLine();

            visualSegment.setAutoRefresh(false);
            visualSegment.setVisible(false);

            visualSegment.getParams().myParent = this._myTorusRootObject;

            this._myVisualSegmentList.push(visualSegment);
        }
    }

    clone() {
        let clonedParams = new PP.VisualTorusParams();
        clonedParams.myRadius = this._myParams.myRadius;
        clonedParams.mySegmentAmount = this._myParams.mySegmentAmount;
        clonedParams.mySegmentThickness = this._myParams.mySegmentThickness;

        clonedParams.myTransform.mat4_copy(this._myParams.myTransform);

        if (this._myParams.myMaterial != null) {
            clonedParams.myMaterial = this._myParams.myMaterial.clone();
        } else {
            clonedParams.myMaterial = null;
        }

        if (this._myParams.myColor != null) {
            clonedParams.myColor.vec4_copy(this._myParams.myColor);
        } else {
            clonedParams.myColor = null;
        }

        clonedParams.myParent = this._myParams.myParent;

        let clone = new PP.VisualTorus(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualTorus.prototype._refresh = function () {
    let segmentStart = PP.vec3_create();
    let segmentEnd = PP.vec3_create();

    let segmentDirection = PP.vec3_create();

    let fixedSegmentStart = PP.vec3_create();
    let fixedSegmentEnd = PP.vec3_create();

    let up = PP.vec3_create(0, 1, 0);
    return function _refresh() {
        this._fillSegmentList();

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.setVisible(false);
        }

        this._myTorusRootObject.pp_setParent(this._myParams.myParent == null ? PP.myVisualData.myRootObject : this._myParams.myParent, false);
        this._myTorusRootObject.pp_setTransformLocal(this._myParams.myTransform);

        let sliceAngle = 2 * Math.PI / this._myParams.mySegmentAmount;
        segmentStart.vec3_set(this._myParams.myRadius, 0, 0);
        for (let i = 0; i < this._myParams.mySegmentAmount; i++) {
            segmentEnd = segmentStart.vec3_rotateAxisRadians(sliceAngle, up, segmentEnd);

            segmentDirection = segmentEnd.vec3_sub(segmentStart, segmentDirection).vec3_normalize(segmentDirection);

            let extraLength = Math.tan(sliceAngle / 2) * this._myParams.mySegmentThickness / 2;

            fixedSegmentStart = segmentStart.vec3_sub(segmentDirection.vec3_scale(extraLength, fixedSegmentStart), fixedSegmentStart);
            fixedSegmentEnd = segmentEnd.vec3_add(segmentDirection.vec3_scale(extraLength, fixedSegmentEnd), fixedSegmentEnd);

            let visualSegment = this._myVisualSegmentList[i];

            let visualSegmentParams = visualSegment.getParams();
            visualSegmentParams.setStartEnd(fixedSegmentStart, fixedSegmentEnd);
            visualSegmentParams.myThickness = this._myParams.mySegmentThickness;

            if (this._myParams.myMaterial == null) {
                if (this._myParams.myColor == null) {
                    visualSegmentParams.myMaterial = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
                } else {
                    if (this._myFlatOpaqueMaterial == null) {
                        this._myFlatOpaqueMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
                    }
                    visualSegmentParams.myMaterial = this._myFlatOpaqueMaterial;
                    this._myFlatOpaqueMaterial.color = this._myParams.myColor;
                }
            } else {
                visualSegmentParams.myMaterial = this._myParams.myMaterial;
            }

            visualSegment.paramsUpdated();

            visualSegment.setVisible(this._myVisible);

            segmentStart.vec3_copy(segmentEnd);
        }
    };
}();



Object.defineProperty(PP.VisualTorus.prototype, "_refresh", { enumerable: false });