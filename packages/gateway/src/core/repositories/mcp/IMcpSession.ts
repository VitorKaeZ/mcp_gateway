import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";

export interface IMcpSessionManager {
    getTransport(sessionId: string | undefined): StreamableHTTPServerTransport | undefined;
    createTransport(mcpServer: McpServer): StreamableHTTPServerTransport;
    registerServer(sessionId: string, server: McpServer): void;
  }