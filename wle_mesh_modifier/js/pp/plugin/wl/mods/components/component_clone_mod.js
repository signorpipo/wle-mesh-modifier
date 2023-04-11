import { CollisionComponent, MeshComponent, PhysXComponent, TextComponent } from "@wonderlandengine/api";
import { CloneUtils } from "../../../../cauldron/utils/clone_utils";
import { MeshUtils } from "../../../../cauldron/utils/mesh_utils";
import { DeepCloneParams } from "../../extensions/object_extension";

export function initComponentCloneMod() {

    MeshComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "material")) {
            clonedComponent.material = this.material.clone();
        }

        if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "mesh")) {
            clonedComponent.mesh = MeshUtils.cloneMesh(this.mesh);
        }

        return clonedComponent;
    };

    CollisionComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    };

    TextComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        if (deepCloneParams.isDeepCloneComponent(TextComponent.TypeName)) {
            clonedComponent.text = this.text.slice(0);
        }

        if (deepCloneParams.isDeepCloneComponentVariable(TextComponent.TypeName, "material")) {
            clonedComponent.material = this.material.clone();
        }

        return clonedComponent;
    };

    PhysXComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    };



    Object.defineProperty(MeshComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(CollisionComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(TextComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(PhysXComponent.prototype, "pp_clone", { enumerable: false });
}