import { VertexManageGroupsVariantsTool } from "./vertex_manage_groups_variants_tool";

export class VertexManageVariantsTool extends VertexManageGroupsVariantsTool {
    constructor(toolData) {
        super(toolData, false, true);
    }
}