/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

/* wle:auto-imports:start */
import {FixedFoveation} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {LoadVariantComponent} from './mesh_modifier/load_variants_component.js';
import {MeshModifierGatewayComponent} from './mesh_modifier/mesh_modifier_gateway_component.js';
import {RemapGroupComponent} from './mesh_modifier/remap_group_component.js';
import {TestDownloadComponent} from './mesh_modifier/test/test_download_component.js';
import {TestLoasFileComponent} from './mesh_modifier/test/test_loadFile_component.js';
import {TestSetAxisComponent} from './mesh_modifier/test/test_set_axis_component.js';
import {ConsoleVRToolComponent} from './pp/index.js';
import {CopyHandTransformComponent} from './pp/index.js';
import {EasyTuneToolComponent} from './pp/index.js';
import {GamepadControlSchemeComponent} from './pp/index.js';
import {GamepadMeshAnimatorComponent} from './pp/index.js';
import {GrabbableComponent} from './pp/index.js';
import {GrabberHandComponent} from './pp/index.js';
import {PPGatewayComponent} from './pp/index.js';
import {PlayerLocomotionComponent} from './pp/index.js';
import {SetActiveComponent} from './pp/index.js';
import {SetHandLocalTransformComponent} from './pp/index.js';
import {SetHeadLocalTransformComponent} from './pp/index.js';
import {SpatialAudioListenerComponent} from './pp/index.js';
import {SwitchHandObjectComponent} from './pp/index.js';
import {ToolCursorComponent} from './pp/index.js';
import {TrackedHandDrawAllJointsComponent} from './pp/index.js';
/* wle:auto-imports:end */

import * as API from '@wonderlandengine/api'; // Deprecated: Backward compatibility.
import { loadRuntime } from '@wonderlandengine/api';
import { initPP } from './pp/index.js';

/* wle:auto-constants:start */
const ProjectName = 'wle_mesh_modifier';
const RuntimeBaseName = 'WonderlandRuntime';
const WithPhysX = true;
const WithLoader = true;
const WebXRFramebufferScaleFactor = 1;
const WebXRRequiredFeatures = ['local',];
const WebXROptionalFeatures = ['local','local-floor','hand-tracking','hit-test',];
/* wle:auto-constants:end */

const engine = await loadRuntime(RuntimeBaseName, {
    physx: WithPhysX,
    loader: WithLoader,
});
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.xrFramebufferScaleFactor = WebXRFramebufferScaleFactor;
engine.onSceneLoaded.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(mode, WebXRRequiredFeatures, WebXROptionalFeatures)
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.dataset.supported = engine.arSupported;
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported;
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(FixedFoveation);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(LoadVariantComponent);
engine.registerComponent(MeshModifierGatewayComponent);
engine.registerComponent(RemapGroupComponent);
engine.registerComponent(TestDownloadComponent);
engine.registerComponent(TestLoasFileComponent);
engine.registerComponent(TestSetAxisComponent);
engine.registerComponent(ConsoleVRToolComponent);
engine.registerComponent(CopyHandTransformComponent);
engine.registerComponent(EasyTuneToolComponent);
engine.registerComponent(GamepadControlSchemeComponent);
engine.registerComponent(GamepadMeshAnimatorComponent);
engine.registerComponent(GrabbableComponent);
engine.registerComponent(GrabberHandComponent);
engine.registerComponent(PPGatewayComponent);
engine.registerComponent(PlayerLocomotionComponent);
engine.registerComponent(SetActiveComponent);
engine.registerComponent(SetHandLocalTransformComponent);
engine.registerComponent(SetHeadLocalTransformComponent);
engine.registerComponent(SpatialAudioListenerComponent);
engine.registerComponent(SwitchHandObjectComponent);
engine.registerComponent(ToolCursorComponent);
engine.registerComponent(TrackedHandDrawAllJointsComponent);
/* wle:auto-register:end */

initPP(engine);

engine.scene.load(`${ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
