import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { IMcpSessionManager } from "../../core/repositories/mcp/IMcpSession";

export class McpSessionManager implements IMcpSessionManager {
    private transports: Map<string, StreamableHTTPServerTransport> = new Map();
    private servers: Map<string, McpServer> = new Map();

    public getTransport(sessionId: string | undefined): StreamableHTTPServerTransport | undefined {
        if (sessionId) {
            return this.transports.get(sessionId);
        }
    }

    public createTransport(mcpServer: McpServer): StreamableHTTPServerTransport {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => crypto.randomUUID(),
            onsessioninitialized: (sessionId) => {
                this.transports.set(sessionId, transport);
                this.servers.set(sessionId, mcpServer);
                console.log(`[McpSessionManager] Nova sessão MCP inicializada: ${sessionId}`);

            },
            enableDnsRebindingProtection: true,
            allowedHosts: ['localhost:4000'],

        });

        transport.onclose = () => {
            if (transport.sessionId) {
                this.transports.delete(transport.sessionId);
                this.servers.delete(transport.sessionId);
                console.log(`[McpSessionManager] Sessão MCP fechada: ${transport.sessionId}`);
            }
        };

        return transport;
    }


    public registerServer(sessionId: string, server: McpServer): void {
        this.servers.set(sessionId, server);
    }


}