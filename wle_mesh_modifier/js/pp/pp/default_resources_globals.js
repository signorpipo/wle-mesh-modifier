import { getMainEngine } from "../cauldron/wl/engine_globals";

let _myDefaultResourcesContainer = new WeakMap();

export function getDefaultResources(engine = getMainEngine()) {
    return _myDefaultResourcesContainer.get(engine);
}

export function setDefaultResources(defaultResources, engine = getMainEngine()) {
    _myDefaultResourcesContainer.set(engine, defaultResources);
}

export function removeDefaultResources(engine = getMainEngine()) {
    _myDefaultResourcesContainer.delete(engine);
}

export function hasDefaultResources(engine = getMainEngine()) {
    return _myDefaultResourcesContainer.has(engine);
}

export function getDefaultMeshes(engine = getMainEngine()) {
    let defaultResources = getDefaultResources(engine);

    if (defaultResources != null) {
        return defaultResources.myMeshes;
    }

    return null;
}

export function getDefaultMaterials(engine = getMainEngine()) {
    let defaultResources = getDefaultResources(engine);

    if (defaultResources != null) {
        return defaultResources.myMaterials;
    }

    return null;
}