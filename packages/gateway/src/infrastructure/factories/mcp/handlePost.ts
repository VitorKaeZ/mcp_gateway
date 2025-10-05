import { McpHandlePostService } from "../../../application/usecases/mcp/mcp-handle-post-on-service";
import { HandlePostController } from "../../../interfaces/controllers/mcp/HandlePostController";

import { mcpSessionManager, mcpServer } from "../../mcp/mcpInstances";

export const HandlePost = (): HandlePostController => {
    
    const mcpHandlePostService = new McpHandlePostService(mcpSessionManager, mcpServer);
    const handlePostController = new HandlePostController(mcpHandlePostService);
    return handlePostController;
};