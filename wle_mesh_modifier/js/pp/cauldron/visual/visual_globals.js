import { getMainEngine } from "../wl/engine_globals";

let _myVisualResourcesContainer = new WeakMap();
let _myVisualManagers = new WeakMap();

export function getVisualResources(engine = getMainEngineinEngine()) {
    return _myVisualResourcesContainer.get(engine);
}

export function setVisualResources(visualResources, engine = getMainEngine()) {
    _myVisualResourcesContainer.set(engine, visualResources);
}

export function removeVisualResources(engine = getMainEngine()) {
    _myVisualResourcesContainer.delete(engine);
}

export function hasVisualResources(engine = getMainEngine()) {
    return _myVisualResourcesContainer.has(engine);
}

export function getVisualManager(engine = getMainEngine()) {
    return _myVisualManagers.get(engine);
}

export function setVisualManager(visualManager, engine = getMainEngine()) {
    _myVisualManagers.set(engine, visualManager);
}

export function removeVisualManager(engine = getMainEngine()) {
    _myVisualManagers.delete(engine);
}

export function hasVisualManager(engine = getMainEngine()) {
    return _myVisualManagers.has(engine);
}