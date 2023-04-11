import { AnimationComponent, Component, Property } from "@wonderlandengine/api";
import { GamepadControlSchemeComponent, MaterialUtils, getScene } from "../pp";
import { setSelectedVertexColor } from "./selected_vertex_params";
import { ToolManager, ToolManagerParams } from "./tool/tool_manager";

export class MeshModifierGatewayComponent extends Component {
    static TypeName = "mesh-modifier-gateway";
    static Properties = {
        _myForceMeshRefresh: Property.bool(false),
        _myUpdateNormals: Property.bool(false),
        _mySelectedVertexColor: Property.int(46),
        _myVertexGroupConfigPath: Property.string(),
        _myMeshObject: Property.object(),
        _myMeshFilePath: Property.string(),
        _myMeshFileMaterial: Property.material(),
        _myAnimationToPlay: Property.animation(),
        _myRestPoseAnimation: Property.animation(),
        _myShadeType: Property.enum(["flat", "smooth"], "flat"),
        _myEnableDownload: Property.bool(false),
        _myPointerObject: Property.object(),
        _myToolLabel: Property.object(),
        _myGroupLabel: Property.object(),
        _myVariantLabel: Property.object(),
        _myLeftControlScheme: Property.object(),
        _myRightControlScheme: Property.object(),
        _myPropsObject: Property.object()
    };

    init() {
        this._myStarted = false;
    }

    start() {
        if (this._myMeshObject == null) {
            getScene(this.engine).append(this._myMeshFilePath).then(function (meshObject) {
                meshObject.pp_setParent(this._myPropsObject);
                meshObject.pp_resetTransformLocal();
                MaterialUtils.setObjectMaterial(meshObject, this._myMeshFileMaterial);
                this._start(meshObject);
            }.bind(this)
            );
        } else {
            this._start(this._myMeshObject);
        }
    }

    update(dt) {
        if (this._myStarted) {
            this._myToolManager.update(dt);
        }
    }

    _start(meshObject) {
        let params = new ToolManagerParams();

        params.myForceMeshRefresh = this._myForceMeshRefresh;

        params.myMeshObject = meshObject;

        let animationComponent = params.myMeshObject.pp_getComponent(AnimationComponent);

        if (animationComponent != null) {
            params.myMeshAnimationObject = animationComponent.object;
        }

        params.myAnimationToPlay = this._myAnimationToPlay;
        params.myRestPoseAnimation = this._myRestPoseAnimation;

        params.myIsFlatShading = this._myShadeType == 0;
        params.myPointerObject = this._myPointerObject;
        params.myToolLabel = this._myToolLabel;
        params.myGroupLabel = this._myGroupLabel;
        params.myVariantLabel = this._myVariantLabel;
        params.myVariantGroupConfigPath = this._myVertexGroupConfigPath;
        params.myLeftControlScheme = this._myLeftControlScheme.pp_getComponent(GamepadControlSchemeComponent);
        params.myRightControlScheme = this._myRightControlScheme.pp_getComponent(GamepadControlSchemeComponent);

        params.myEnableDownload = this._myEnableDownload;

        setSelectedVertexColor(this._mySelectedVertexColor);
        VertexUtils.updateVertexNormalsActive = this._myUpdateNormals;

        this._myToolManager = new ToolManager(params);

        this._myStarted = true;
    }
}