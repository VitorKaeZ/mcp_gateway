import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { McpSessionManager } from './McpSessionManager';
import { McpServerManager } from '../../core/entities/mcp/server';

// Este ficheiro cria as instâncias APENAS UMA VEZ quando a aplicação arranca.
console.log("[Singleton] A criar instâncias de McpServer e McpSessionManager...");

export const mcpSessionManager = new McpSessionManager();
export const mcpServer = new McpServerManager();