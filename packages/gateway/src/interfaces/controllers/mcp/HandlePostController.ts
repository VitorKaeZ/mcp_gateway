import { ServerResponse } from "node:http";
import { McpHandlePostService } from "../../../application/usecases/mcp/mcp-handle-post-on-service";
import { ok, serverError, unauthorized } from "../helpers/http.helpers";
import { HttpRequest, HttpResponse } from "../ports/http";
import { FastifyReply, FastifyRequest } from "fastify";

export class HandlePostController {
    constructor(private mcpHandlePostService: McpHandlePostService) {}

    
    async handle(req: FastifyRequest, res: FastifyReply): Promise<HttpResponse | void> {
        try {
            const body = req.body;
            const sessionId = req.headers['mcp-session-id'] as string | undefined;
            console.log("[HandlePostController] Received MCP request with session ID:", sessionId);
            const result = await this.mcpHandlePostService.handle(body, sessionId);
            
            if (result.isLeft()) {
                
                return unauthorized(result.value);
            }   

            const transport = result.value;

            
                
                
                await transport.handleRequest(req.raw, res.raw, body);
                
                
                
                
           
        } catch (error) {
            console.error("[HandlePostController] Unhandled Error:", error);
            return serverError(error instanceof Error ? error.message : 'An internal server error occurred.');
        }
    }
}