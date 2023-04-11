import { getMainEngine } from "../wl/engine_globals";

export function getSession(engine = getMainEngine()) {
    return engine.xrSession;
}

export function isSessionActive(engine = getMainEngine()) {
    return getSession(engine) != null;
}

export function registerSessionStartEventListener(id, callback, manuallyCallSessionStartIfSessionAlreadyActive = false, addManualCallFlagToStartCallback = false, engine = getMainEngine()) {
    if (callback != null) {
        if (manuallyCallSessionStartIfSessionAlreadyActive && isSessionActive(engine)) {
            if (addManualCallFlagToStartCallback) {
                callback(true, getSession(engine));
            } else {
                callback(getSession(engine));
            }
        }

        if (addManualCallFlagToStartCallback) {
            engine.onXRSessionStart.add(callback.bind(undefined, false), { id: id });
        } else {
            engine.onXRSessionStart.add(callback, { id: id });
        }
    }
}

export function unregisterSessionStartEventListener(id, engine = getMainEngine()) {
    engine.onXRSessionStart.remove(id);
}

export function registerSessionEndEventListener(id, callback, engine = getMainEngine()) {
    if (callback != null) {
        engine.onXRSessionEnd.add(callback, { id: id });
    }
}

export function unregisterSessionEndEventListener(id, engine = getMainEngine()) {
    return engine.onXRSessionEnd.remove(id);
}

export function registerSessionStartEndEventListeners(id, startCallback, endCallback, manuallyCallSessionStartIfSessionAlreadyActive = false, addManualCallFlagToStartCallback = false, engine = getMainEngine()) {
    registerSessionStartEventListener(id, startCallback, manuallyCallSessionStartIfSessionAlreadyActive, addManualCallFlagToStartCallback, engine);
    registerSessionEndEventListener(id, endCallback, engine);
}

export function unregisterSessionStartEndEventListeners(id, engine = getMainEngine()) {
    unregisterSessionStartEventListener(id, engine);
    unregisterSessionEndEventListener(id, engine);
}

export function isReferenceSpaceLocalFloor(engine = getMainEngine()) {
    return !["local", "viewer"].includes(getReferenceSpaceType(engine));
}

export function getReferenceSpaceType(engine = getMainEngine()) {
    let refSpace = "local";

    try {
        refSpace = getWebXR(engine).refSpace;;
    } catch (error) {

    }

    return refSpace;
}

export function getWebXR(engine = getMainEngine()) {
    return engine.wasm.WebXR;
}

export function getFrame(engine = getMainEngine()) {
    return engine.xrFrame;
}

export function isVRSupported(engine = getMainEngine()) {
    return engine.vrSupported;
}

export function isARSupported(engine = getMainEngine()) {
    return engine.arSupported;
}

export function isDeviceEmulated() {
    let isEmulated = ("CustomWebXRPolyfill" in window);
    return isEmulated;
}

export let XRUtils = {
    getSession,
    isSessionActive,
    registerSessionStartEventListener,
    unregisterSessionStartEventListener,
    registerSessionEndEventListener,
    unregisterSessionEndEventListener,
    registerSessionStartEndEventListeners,
    unregisterSessionStartEndEventListeners,
    isReferenceSpaceLocalFloor,
    getReferenceSpaceType,
    getFrame,
    isVRSupported,
    isARSupported,
    isDeviceEmulated
};