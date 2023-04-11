export function assignProperties(fromReference, toReference, enumerable = true, writable = true, configurable = true, keepOriginalDescriptorAttributes = true) {
    let ownPropertyNames = Object.getOwnPropertyNames(fromReference);
    for (let ownPropertyName of ownPropertyNames) {
        let enumerableToUse = enumerable;
        let writableToUse = writable;
        let configurableToUse = configurable;

        if (keepOriginalDescriptorAttributes) {
            let originalDescriptor = Object.getOwnPropertyDescriptor(toReference, ownPropertyName);
            if (originalDescriptor != null) {
                enumerableToUse = originalDescriptor.enumerable;
                writableToUse = originalDescriptor.writable;
                configurableToUse = originalDescriptor.configurable;
            }
        }

        Object.defineProperty(toReference, ownPropertyName, {
            value: fromReference[ownPropertyName],
            enumerable: enumerableToUse,
            writable: writableToUse,
            configurable: configurableToUse
        });
    }
}

export let PluginUtils = {
    assignProperties
};