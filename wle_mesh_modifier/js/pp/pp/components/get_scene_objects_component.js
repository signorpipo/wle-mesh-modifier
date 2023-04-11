import { Component, Property } from "@wonderlandengine/api";
import { Handedness } from "../../input/cauldron/input_types";
import { SceneObjects } from "../scene_objects";
import { getSceneObjects, hasSceneObjects, removeSceneObjects, setSceneObjects } from "../scene_objects_global";

export class GetSceneObjectsComponent extends Component {
    static TypeName = "pp-get-scene-objects";
    static Properties = {
        _myScene: Property.object(),

        _myPlayer: Property.object(),
        _myPlayerPivot: Property.object(),   // If u don't have a pivot under the player you set this to null, by default will be the same as the player
        _myCameraNonXR: Property.object(),
        _myEyeLeft: Property.object(),
        _myEyeRight: Property.object(),
        _myHandLeft: Property.object(),
        _myHandRight: Property.object(),
        _myHead: Property.object()
    };

    init() {
        this._mySceneObjects = null;

        // Prevents double global from same engine
        if (!hasSceneObjects(this.engine)) {
            this._mySceneObjects = new SceneObjects();

            this._mySceneObjects.myScene = this._myScene;

            this._mySceneObjects.myPlayerObjects.myPlayer = this._myPlayer;
            this._mySceneObjects.myPlayerObjects.myPlayerPivot = this._myPlayerPivot;

            this._mySceneObjects.myPlayerObjects.myCameraNonXR = this._myCameraNonXR;

            this._mySceneObjects.myPlayerObjects.myEyeLeft = this._myEyeLeft;
            this._mySceneObjects.myPlayerObjects.myEyeRight = this._myEyeRight;

            this._mySceneObjects.myPlayerObjects.myHandLeft = this._myHandLeft;
            this._mySceneObjects.myPlayerObjects.myHandRight = this._myHandRight;

            this._mySceneObjects.myPlayerObjects.myEyes = [];
            this._mySceneObjects.myPlayerObjects.myEyes[Handedness.LEFT] = this._myEyeLeft;
            this._mySceneObjects.myPlayerObjects.myEyes[Handedness.RIGHT] = this._myEyeRight;

            this._mySceneObjects.myPlayerObjects.myHands = [];
            this._mySceneObjects.myPlayerObjects.myHands[Handedness.LEFT] = this._myHandLeft;
            this._mySceneObjects.myPlayerObjects.myHands[Handedness.RIGHT] = this._myHandRight;

            this._mySceneObjects.myPlayerObjects.myHead = this._myHead;

            if (this._mySceneObjects.myPlayerObjects.myPlayerPivot == null) {
                this._mySceneObjects.myPlayerObjects.myPlayerPivot = this._mySceneObjects.myPlayerObjects.myPlayer;
            }

            this._mySceneObjects.myCauldron = this._mySceneObjects.myScene.pp_addObject();
            this._mySceneObjects.myCauldron.pp_setName("Cauldron");
            this._mySceneObjects.myDynamics = this._mySceneObjects.myScene.pp_addObject();
            this._mySceneObjects.myDynamics.pp_setName("Dynamics");
            this._mySceneObjects.myParticles = this._mySceneObjects.myScene.pp_addObject();
            this._mySceneObjects.myParticles.pp_setName("Particles");
            this._mySceneObjects.myVisualElements = this._mySceneObjects.myScene.pp_addObject();
            this._mySceneObjects.myVisualElements.pp_setName("Visual Elements");
            this._mySceneObjects.myTools = this._mySceneObjects.myScene.pp_addObject();
            this._mySceneObjects.myTools.pp_setName("Tools");

            this._mySceneObjects.myPlayerObjects.myPlayerCauldron = this._mySceneObjects.myPlayerObjects.myPlayer.pp_addObject();
            this._mySceneObjects.myPlayerObjects.myPlayerCauldron.pp_setName("Player Cauldron");

            setSceneObjects(this._mySceneObjects, this.engine);
        }
    }

    onDestroy() {
        if (this._mySceneObjects != null && getSceneObjects(this.engine) == this._mySceneObjects) {
            removeSceneObjects(this.engine);
        }
    }
}