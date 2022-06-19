downloadFileText = function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    return true;
};

downloadFileJSON = function (filename, object) {
    let json = null;
    try {
        json = JSON.stringify(object);
    } catch (error) { }

    if (json != null) {
        return downloadFileText(filename, json);
    }

    return false;
};

loadFileText = function (filepath, loadCallback, errorCallback) {
    loadFile("text", filepath, loadCallback, errorCallback);
};

loadFileJSON = function (filepath, loadCallback, errorCallback) {
    loadFile("json", filepath, loadCallback, errorCallback);
};

loadFile = function (responseBodyConversionFunction, filepath, loadCallback, errorCallback) {
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
                        function () {
                            if (errorCallback != null) {
                                errorCallback();
                            }
                        }
                    );
                } else {
                    if (errorCallback != null) {
                        errorCallback();
                    }
                }
            },
            function () {
                if (errorCallback != null) {
                    errorCallback();
                }
            }
        );
};