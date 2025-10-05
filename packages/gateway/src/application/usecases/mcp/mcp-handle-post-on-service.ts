import { isInitializeRequest } from "@modelcontextprotocol/sdk/types";
import { IMcpSessionManager } from "../../../core/repositories/mcp/IMcpSession";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { RequestBodyDefault } from "fastify";
import { IMcpServer } from "../../../core/repositories/mcp/IMcpServer";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { Either, left, right } from "../../../shared/either";
import { FailedCreateMcpServerError } from "../errors/failed-create-mcpserver-error";
import { FailedCreateTransportError } from "../errors/failed-create-transport-error";

export class McpHandlePostService {
    private mcpSession: IMcpSessionManager;
    private mcpServer: McpServer;


    constructor(mcpSession: IMcpSessionManager, mcpServer: McpServer) {
        this.mcpSession = mcpSession;
        this.mcpServer = mcpServer
    }

    async handle(body: RequestBodyDefault, sessionId: string | undefined): Promise<Either<FailedCreateMcpServerError | FailedCreateTransportError, StreamableHTTPServerTransport>> {

         if (!this.mcpServer) {
             return left(new FailedCreateMcpServerError());
         }
         
        let transport = this.mcpSession.getTransport(sessionId);

        if (transport) {
            return right(transport);
        }

        if (!sessionId && isInitializeRequest(body)) {

            transport = this.mcpSession.createTransport(this.mcpServer);

            if (!transport) {
                return left(new FailedCreateTransportError());
            }

            await this.mcpServer.connect(transport);

            return right(transport);
        
        
    } else {
        return left(new Error("Invalid or missing session ID"));
    }
    }
}