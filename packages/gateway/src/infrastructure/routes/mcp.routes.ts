

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { toolServerRegistry } from "../../config/tools.config";
import { LocalToolClientManager } from "../clients/localToolClientManager";
import { ToolRegistryService } from "../../application/services/toolRegistry.js";
import { z } from "zod/v3";
import { zodToRaw } from "../../shared/zod";
import { HandlePost } from "../factories/mcp/handlePost";
import { adaptRoute } from "../adapters/fastify.route.adapter";

import { tr } from "zod/v4/locales";
import { mcpSessionManager } from "../mcp/mcpInstances";
import { HandlePostController } from "../../interfaces/controllers/mcp/HandlePostController";

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};


const servers = new Map<string, McpServer>();




export async function mcpRoutes(server: FastifyInstance) {
    
    

    


server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
        const controller = HandlePost();
        await controller.handle(request, reply);
});

const handleSessionRequest = async (req: FastifyRequest, res: FastifyReply) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    const transport = mcpSessionManager.getTransport(sessionId)

    if (!sessionId || !transport) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    console.log(`[MCP] Manipulando requisição para a sessão MCP: ${sessionId}`);
    await transport.handleRequest(req.raw, res.raw);
};


    server.get("/", handleSessionRequest);
    server.delete("/", handleSessionRequest);
}