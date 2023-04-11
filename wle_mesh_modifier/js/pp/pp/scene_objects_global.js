import { getMainEngine } from "../cauldron/wl/engine_globals";

let _mySceneObjectsContainer = new WeakMap();

export function getSceneObjects(engine = getMainEngine()) {
    return _mySceneObjectsContainer.get(engine);
}

export function setSceneObjects(sceneObjects, engine = getMainEngine()) {
    _mySceneObjectsContainer.set(engine, sceneObjects);
}

export function removeSceneObjects(engine = getMainEngine()) {
    _mySceneObjectsContainer.delete(engine);
}

export function hasSceneObjects(engine = getMainEngine()) {
    return _mySceneObjectsContainer.has(engine);
}

export function getPlayerObjects(engine = getMainEngine()) {
    let sceneObjects = getSceneObjects(engine);

    if (sceneObjects != null) {
        return sceneObjects.myPlayerObjects;
    }

    return null;
}