import { ObjectPoolParams } from "../cauldron/object_pool";
import { ObjectPoolsManager } from "../cauldron/object_pools_manager";
import { Timer } from "../cauldron/timer";
import { getMainEngine } from "../wl/engine_globals";
import { VisualArrow, VisualArrowParams } from "./elements/visual_arrow";
import { VisualElementType } from "./elements/visual_element_types";
import { VisualLine, VisualLineParams } from "./elements/visual_line";
import { VisualMesh, VisualMeshParams } from "./elements/visual_mesh";
import { VisualPoint, VisualPointParams } from "./elements/visual_point";
import { VisualRaycast, VisualRaycastParams } from "./elements/visual_raycast";
import { VisualText, VisualTextParams } from "./elements/visual_text";
import { VisualTorus, VisualTorusParams } from "./elements/visual_torus";
import { VisualTransform, VisualTransformParams } from "./elements/visual_transform";

export class VisualManager {

    constructor(engine = getMainEngine()) {
        this._myEngine = engine;

        this._myVisualElementPrototypeCreationCallbacks = new Map();

        this._myVisualElementsTypeMap = new Map();
        this._myVisualElementLastID = 0;
        this._myVisualElementsPool = new ObjectPoolsManager();
        this._myVisualElementsToShow = [];

        this._myActive = true;

        this._addStandardVisualElementTypes();
    }

    setActive(active) {
        if (this._myActive != active) {
            this._myActive = active;

            if (!this._myActive) {
                this.clearDraw();
            }
        }
    }

    isActive() {
        return this._myActive;
    }

    start() {

    }

    update(dt) {
        if (this._myActive) {
            this._updateDraw(dt);
        }
    }

    // lifetimeSeconds can be null, in that case the element will be drawn until cleared
    draw(visualElementParams, lifetimeSeconds = 0, idToReuse = null) {
        if (!this._myActive) {
            return 0;
        }

        let visualElement = null;
        let idReused = false;
        if (idToReuse != null) {
            if (this._myVisualElementsTypeMap.has(visualElementParams.myType)) {
                let visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType);
                if (visualElements.has(idToReuse)) {
                    visualElement = visualElements.get(idToReuse)[0];
                    visualElement.copyParams(visualElementParams);
                    visualElement.setVisible(false);
                    idReused = true;
                }
            }
        }

        if (visualElement == null) {
            visualElement = this._getVisualElement(visualElementParams);
        }

        if (visualElement == null) {
            console.error("Couldn't create the requested visual element");
            return null;
        }

        if (!this._myVisualElementsTypeMap.has(visualElementParams.myType)) {
            this._myVisualElementsTypeMap.set(visualElementParams.myType, new Map());
        }
        let visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType);

        let elementID = null;
        if (!idReused) {
            elementID = this._myVisualElementLastID + 1;
            this._myVisualElementLastID = elementID;

            visualElements.set(elementID, [visualElement, new Timer(lifetimeSeconds, lifetimeSeconds != null)]);
        } else {
            elementID = idToReuse;
            let visualElementPair = visualElements.get(elementID);
            visualElementPair[0] = visualElement;
            visualElementPair[1].reset(lifetimeSeconds);
            if (lifetimeSeconds != null) {
                visualElementPair[1].start();
            }
        }

        this._myVisualElementsToShow.push(visualElement);

        return elementID;
    }

    getDraw(elementID) {
        let visualElement = null;

        for (let visualElements of this._myVisualElementsTypeMap.values()) {
            if (visualElements.has(elementID)) {
                let visualElementPair = visualElements.get(elementID);
                visualElement = visualElementPair[0];
                break;
            }
        }

        return visualElement;
    }

    clearDraw(elementID = null) {
        if (elementID == null) {
            for (let visualElements of this._myVisualElementsTypeMap.values()) {
                for (let visualElement of visualElements.values()) {
                    this._myVisualElementsPool.releaseObject(visualElement[0].getParams().myType, visualElement[0]);
                }
            }

            this._myVisualElementsToShow = [];
            this._myVisualElementsTypeMap = new Map();
            this._myVisualElementLastID = 0;
        } else {
            for (let visualElements of this._myVisualElementsTypeMap.values()) {
                if (visualElements.has(elementID)) {
                    let visualElementPair = visualElements.get(elementID);
                    this._myVisualElementsPool.releaseObject(visualElementPair[0].getParams().myType, visualElementPair[0]);
                    visualElements.delete(elementID);

                    this._myVisualElementsToShow.pp_removeEqual(visualElementPair[0]);
                    break;
                }
            }
        }
    }

    allocateDraw(visualElementType, amount) {
        if (!this._myVisualElementsPool.hasPool(visualElementType)) {
            this._addVisualElementTypeToPool(visualElementType);
        }

        let pool = this._myVisualElementsPool.getPool(visualElementType);

        let difference = pool.getAvailableSize() - amount;
        if (difference < 0) {
            pool.increase(-difference);
        }
    }

    addVisualElementType(visualElementType, visuaElementPrototypeCreationCallback) {
        this._myVisualElementPrototypeCreationCallbacks.set(visualElementType, visuaElementPrototypeCreationCallback);
    }

    removeVisualElementType(visualElementType) {
        this._myVisualElementPrototypeCreationCallbacks.delete(visualElementType);
    }

    _updateDraw(dt) {
        for (let visualElement of this._myVisualElementsToShow) {
            visualElement.setVisible(true);
        }
        this._myVisualElementsToShow = [];

        for (let visualElements of this._myVisualElementsTypeMap.values()) {
            let idsToRemove = [];
            for (let visualElementsEntry of visualElements.entries()) {
                let visualElement = visualElementsEntry[1];
                if (visualElement[1].isDone()) {
                    this._myVisualElementsPool.releaseObject(visualElement[0].getParams().myType, visualElement[0]);
                    idsToRemove.push(visualElementsEntry[0]);
                }

                visualElement[1].update(dt);
            }

            for (let id of idsToRemove) {
                visualElements.delete(id);
            }
        }
    }

    _getVisualElement(params) {
        let element = null;

        if (!this._myVisualElementsPool.hasPool(params.myType)) {
            this._addVisualElementTypeToPool(params.myType);
        }

        element = this._myVisualElementsPool.getObject(params.myType);

        if (element != null) {
            element.copyParams(params);
        }

        return element;
    }

    _addVisualElementTypeToPool(type) {
        let objectPoolParams = new ObjectPoolParams();
        objectPoolParams.myInitialPoolSize = 10;
        objectPoolParams.myAmountToAddWhenEmpty = 0;
        objectPoolParams.myPercentageToAddWhenEmpty = 0.5;
        objectPoolParams.mySetActiveCallback = function (object, active) {
            object.setVisible(active);
        };

        let visualElementPrototype = null;
        if (this._myVisualElementPrototypeCreationCallbacks.has(type)) {
            visualElementPrototype = this._myVisualElementPrototypeCreationCallbacks.get(type)();
        }

        if (visualElementPrototype != null) {
            visualElementPrototype.setVisible(false);
            visualElementPrototype.setAutoRefresh(true);

            this._myVisualElementsPool.addPool(type, visualElementPrototype, objectPoolParams);
        } else {
            console.error("Visual element type not supported");
        }
    }

    _addStandardVisualElementTypes() {
        this.addVisualElementType(VisualElementType.LINE, () => new VisualLine(new VisualLineParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.MESH, () => new VisualMesh(new VisualMeshParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.POINT, () => new VisualPoint(new VisualPointParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.ARROW, () => new VisualArrow(new VisualArrowParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TEXT, () => new VisualText(new VisualTextParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TRANSFORM, () => new VisualTransform(new VisualTransformParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.RAYCAST, () => new VisualRaycast(new VisualRaycastParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TORUS, () => new VisualTorus(new VisualTorusParams(this._myEngine)));
    }
}