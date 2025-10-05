import { McpHandlePostService } from "../../../application/usecases/mcp/mcp-handle-post-on-service";
import { HandlePostController } from "../../../interfaces/controllers/mcp/HandlePostController";
// --- Alteração Principal: Importar do novo ficheiro de instâncias ---
import { mcpSessionManager, mcpServer } from "../../mcp/mcpInstances";

export const HandlePost = (): HandlePostController => {
    // Agora, estamos a usar as instâncias partilhadas em vez de criar novas.
    const mcpHandlePostService = new McpHandlePostService(mcpSessionManager, mcpServer);
    const handlePostController = new HandlePostController(mcpHandlePostService);
    return handlePostController;
};