import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { McpSessionManager } from './McpSessionManager';
import { McpServerManager } from '../../core/entities/mcp/server';


console.log("[Singleton] A criar instâncias de McpServer e McpSessionManager...");

export const mcpSessionManager = new McpSessionManager();
export const mcpServer = new McpServerManager();