export function downloadFileText(filename, text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    let element = document.createElement("a");
    element.href = url;
    element.download = filename;
    element.style.display = "none";

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    return true;
}

export function downloadFileJSON(filename, object) {
    let json = null;
    try {
        json = JSON.stringify(object);
    } catch (error) { }

    if (json != null) {
        return downloadFileText(filename, json);
    }

    return false;
}

export function loadFileText(filepath, loadCallback, errorCallback) {
    loadFile("text", filepath, loadCallback, errorCallback);
}

export function loadFileJSON(filepath, loadCallback, errorCallback) {
    loadFile("json", filepath, loadCallback, errorCallback);
}

export function loadFileBlob(filepath, loadCallback, errorCallback) {
    loadFile("blob", filepath, loadCallback, errorCallback);
}

export function loadFile(responseBodyConversionFunction, filepath, loadCallback, errorCallback) {
    fetch(filepath)
        .then(
            function (response) {
                if (response.ok) {
                    response[responseBodyConversionFunction]().then(
                        function (data) {
                            if (loadCallback) {
                                loadCallback(data);
                            }
                        },
                        function (response) {
                            if (errorCallback != null) {
                                errorCallback(response);
                            }
                        }
                    );
                } else {
                    if (errorCallback != null) {
                        errorCallback(response);
                    }
                }
            },
            function (response) {
                if (errorCallback != null) {
                    errorCallback(response);
                }
            }
        );
}