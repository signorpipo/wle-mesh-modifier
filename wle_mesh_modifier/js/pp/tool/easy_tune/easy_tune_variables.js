export class EasyTuneVariables {

    constructor() {
        this._myVariables = new Map();
    }

    add(variable) {
        this._myVariables.set(variable.getName(), variable);
    }

    remove(variableName) {
        this._myVariables.delete(variableName);
    }

    get(variableName) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            return variable.getValue();
        }

        return null;
    }

    set(variableName, value, resetDefaultValue = false) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            variable.setValue(value, resetDefaultValue);
        }
    }

    has(variableName) {
        return this._myVariables.has(variableName);
    }

    length() {
        return this._myVariables.size;
    }

    isActive(variableName) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            return variable.isActive();
        }

        return false;
    }

    getEasyTuneVariable(variableName) {
        return this._myVariables.get(variableName);
    }

    getEasyTuneVariablesList() {
        return Array.from(this._myVariables.values());
    }

    getEasyTuneVariablesNames() {
        return Array.from(this._myVariables.keys());
    }

    fromJSON(json, resetDefaultValue = false) {
        let objectJSON = JSON.parse(json);

        for (let variable of this._myVariables.values()) {
            let variableValueJSON = objectJSON[variable.getName()];
            if (variableValueJSON !== undefined) {
                variable.fromJSON(variableValueJSON, resetDefaultValue);
            }
        }
    }

    toJSON() {
        let objectJSON = {};

        for (let variable of this._myVariables.values()) {
            objectJSON[variable.getName()] = variable.toJSON();
        }

        return JSON.stringify(objectJSON);
    }

    registerValueChangedEventListener(variableName, callbackID, callback) {
        this._myVariables.get(variableName).registerValueChangedEventListener(callbackID, callback);
    }

    unregisterValueChangedEventListener(variableName, callbackID, callback) {
        this._myVariables.get(variableName).unregisterValueChangedEventListener(callbackID);
    }
}