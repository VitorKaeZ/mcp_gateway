import { ServerResponse } from "node:http";
import { McpHandlePostService } from "../../../application/usecases/mcp/mcp-handle-post-on-service";
import { ok, serverError, unauthorized } from "../helpers/http.helpers";
import { HttpRequest, HttpResponse } from "../ports/http";
import { FastifyReply, FastifyRequest } from "fastify";

export class HandlePostController {
    constructor(private mcpHandlePostService: McpHandlePostService) {}

    // A assinatura pode retornar Promise<HttpResponse | void> para indicar que nem sempre retorna um valor.
    async handle(req: FastifyRequest, res: FastifyReply): Promise<HttpResponse | void> {
        try {
            const body = req.body;
            const sessionId = req.headers['mcp-session-id'] as string | undefined;
            console.log("[HandlePostController] Received MCP request with session ID:", sessionId);
            const result = await this.mcpHandlePostService.handle(body, sessionId);
            
            if (result.isLeft()) {
                // Se houver um erro, retorne a resposta de erro normalmente.
                return unauthorized(result.value);
            }   

            const transport = result.value;

            // Verifique se os objetos raw e reply existem antes de usá-los.
                // Passe os objetos raw para o manipulador do MCP.
                // O `reply.raw` é o objeto ServerResponse que a biblioteca precisa.
                await transport.handleRequest(req.raw, res.raw, body);
                
                // Como o `handleRequest` já enviou a resposta, não retornamos nada aqui.
                // O nosso adaptador modificado irá verificar se a resposta já foi enviada.
                // return ok({ message: "Request handled successfully" });
           
        } catch (error) {
            console.error("[HandlePostController] Unhandled Error:", error);
            return serverError(error instanceof Error ? error.message : 'An internal server error occurred.');
        }
    }
}