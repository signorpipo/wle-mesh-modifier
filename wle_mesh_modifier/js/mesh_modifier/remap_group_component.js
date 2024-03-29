import { Component, MeshComponent, Property } from "@wonderlandengine/api";
import { getScene } from "../pp";
import { jsonParse, jsonStringify } from "./cauldron_utils";
import { downloadFileText } from "./file_manager";
import { VertexGroupConfig } from "./vertex_group_config";

export class RemapGroupComponent extends Component {
    static TypeName = "remap-group";
    static Properties = {
        _myFromMeshObject: Property.object(),
        _myFromMeshFilePath: Property.string(),
        _myFromMeshVertexGroupConfigPath: Property.string(),
        _myToMeshObject: Property.object(),
        _myToMeshFilePath: Property.string(),
        _myTransformObject: Property.object(),
        _myEnableDownload: Property.bool(false)
    };

    start() {
        this._myConverted = false;

        this._myFromMesh = null;
        this._myToMesh = null;

        this._myFromVertexGroupConfig = null;

        if (this._myFromMeshObject == null) {
            getScene(this.engine).append(this._myFromMeshFilePath).then(function (meshObject) {
                this._myFromMesh = meshObject.pp_getComponent(MeshComponent).mesh;
            }.bind(this));
        } else {
            this._myFromMesh = this._myFromMeshObject.pp_getComponent(MeshComponent).mesh;
        }

        if (this._myToMeshObject == null) {
            getScene(this.engine).append(this._myToMeshFilePath).then(function (meshObject) {
                this._myToMesh = meshObject.pp_getComponent(MeshComponent).mesh;
            }.bind(this));
        } else {
            this._myToMesh = this._myToMeshObject.pp_getComponent(MeshComponent).mesh;
        }

        loadFileText(this._myFromMeshVertexGroupConfigPath,
            function (text) {
                this._myFromVertexGroupConfig = new VertexGroupConfig();
                try {
                    let jsonObject = jsonParse(text);
                    this._myFromVertexGroupConfig.fromJSONObject(jsonObject);
                } catch (error) {
                    this._myFromVertexGroupConfig = new VertexGroupConfig();
                }
            }.bind(this),
            function (response) {
                this._myFromVertexGroupConfig = new VertexGroupConfig();
            }.bind(this)
        );
    }

    update(dt) {
        if (!this._myConverted) {
            if (this._myFromMesh != null && this._myToMesh != null && this._myFromVertexGroupConfig != null) {
                let toVertexGroupConfig = this._myFromVertexGroupConfig.remapToMesh(this._myFromMesh, this._myToMesh, (this._myTransformObject != null) ? this._myTransformObject.pp_getTransformLocal() : undefined);

                let configText = jsonStringify(toVertexGroupConfig);

                if (this.myEnableDownload) {
                    downloadFileText("remapped_vertex_group_config.json", configText);
                }

                console.log("Remapped Vertex Group Config:");
                console.log(configText);

                this._myConverted = true;
            }
        }
    }
}