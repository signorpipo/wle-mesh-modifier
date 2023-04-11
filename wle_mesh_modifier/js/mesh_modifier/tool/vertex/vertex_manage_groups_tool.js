import { VertexManageGroupsVariantsTool } from "./vertex_manage_groups_variants_tool";

export class VertexManageGroupsTool extends VertexManageGroupsVariantsTool {
    constructor(toolData) {
        super(toolData, true, false);
    }
}