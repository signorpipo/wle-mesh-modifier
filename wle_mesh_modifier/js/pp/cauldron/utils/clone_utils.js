export function cloneComponentBase(componentToClone, targetObject) {
    let clonedComponent = targetObject.pp_addComponent(componentToClone.type, componentToClone);

    // trigger start, which otherwise would be called later
    if (!clonedComponent.active) {
        clonedComponent.active = true;
        clonedComponent.active = false;
    }

    return clonedComponent;
}

export let CloneUtils = {
    cloneComponentBase
};