// // packages/gateway/src/infrastructure/routes/mcp.routes.ts

// import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// import { ToolRegistryService } from '../../application/services/toolRegistry';
// import authenticateJwt from '../middlewares/auth-middleware';

// /**
//  * Regista as rotas do Model Context Protocol (MCP) no servidor Fastify.
//  * Estas rotas são o ponto de entrada para clientes de IA interagirem com as ferramentas.
//  *
//  * @param server A instância do servidor Fastify.
//  */
// export const mcpRoutes = async (server: FastifyInstance) => {

//   // Hook de pré-tratamento (preHandler) que aplica o nosso middleware de autenticação
//   // a TODAS as rotas definidas neste ficheiro. Nenhuma rota MCP pode ser acedida
//   // sem um token de autenticação válido.
//   server.addHook('preHandler', authenticateJwt());

//   /**
//    * Endpoint de Descoberta de Ferramentas (GET /mcp/tools)
//    * * Um cliente de IA chama este endpoint para descobrir quais ferramentas estão
//    * disponíveis para o utilizador autenticado. A lista de ferramentas é filtrada
//    * com base nas permissões definidas no ficheiro de configuração.
//    */
//   server.get('/tools', async (request: FastifyRequest, reply: FastifyReply) => {
//     try {
//       // O middleware de autenticação já validou o token e adicionou 'userId' ao objeto 'request'.
//       // Afirmamos o tipo para garantir a segurança de tipos do TypeScript.
//       const userId = (request as any).headers['user-id'];

//       // Delegamos a lógica de negócio para o serviço de registo de ferramentas.
//       const catalog = await ToolRegistryService.getToolCatalogForUser(userId);
      
//       reply.status(200).send(catalog);
//     } catch (error) {
//       console.error("[MCP Routes] Erro ao obter o catálogo de ferramentas:", error);
//       reply.status(500).send({ error: 'Falha ao obter o catálogo de ferramentas.' });
//     }
//   });

//   /**
//    * Endpoint de Execução de Ferramentas (POST /mcp/execute)
//    * * Um cliente de IA chama este endpoint para executar uma ferramenta específica
//    * com um conjunto de parâmetros. O serviço irá verificar novamente as permissões
//    * antes de executar a ferramenta (seja localmente ou via proxy).
//    */
//   server.post('/execute', async (request: FastifyRequest, reply: FastifyReply) => {
//     try {
//       const userId = (request as any).userId;
//       const { toolName, parameters } = request.body as { toolName: string; parameters: any };

//       // Validação básica da entrada
//       if (!toolName) {
//         return reply.status(400).send({ error: 'O campo "toolName" é obrigatório.' });
//       }

//       // Delegamos a lógica de execução e verificação de permissões para o serviço.
//       const result = await ToolRegistryService.executeTool(userId, toolName, parameters);
      
//       reply.status(200).send({ success: true, result });

//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Um erro desconhecido ocorreu';
//       console.error(`[MCP Routes] Erro ao executar a ferramenta '${(request.body as any)?.toolName}':`, errorMessage);

//       // Tratamento de erros específico para fornecer feedback claro ao cliente.
//       if (errorMessage.includes('Acesso negado')) {
//         reply.status(403).send({ success: false, error: errorMessage }); // 403 Forbidden
//       } else if (errorMessage.includes('não encontrada') || errorMessage.includes('não está registrada')) {
//         reply.status(404).send({ success: false, error: errorMessage }); // 404 Not Found
//       } else {
//         reply.status(500).send({ success: false, error: errorMessage }); // 500 Internal Server Error
//       }
//     }
//   });
// };


// packages/gateway/src/infrastructure/routes/mcp.routes.ts

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
// Mapa para armazenar um transporte ativo para cada sessão de cliente.
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Mapa para armazenar o McpServer associado a cada sessão.
const servers = new Map<string, McpServer>();




export async function mcpRoutes(server: FastifyInstance) {
    // Rota principal que lida com todas as interações MCP
    

    // Registra o mesmo manipulador para todas as rotas e métodos do endpoint /mcp.
    server.post("/", async (req: FastifyRequest, res: FastifyReply) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: sessionId => {
                // Store the transport by session ID
                transports[sessionId] = transport;
            }
            // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
            // locally, make sure to set:
            // enableDnsRebindingProtection: true,
            // allowedHosts: ['127.0.0.1'],
        });

        // Clean up transport when closed
        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };
        const server = new McpServer({
            name: 'mcp-gateway',
            version: '1.0.0'
        });

        // ... set up server resources, tools, and prompts ...

          // --- 2. REGISTRE AS FERRAMENTAS AQUI ---
        console.log("[MCP] Registrando ferramentas no servidor...");
        
        // Supondo que você queira registrar todas as ferramentas para qualquer usuário por enquanto
        // NOTA: Você precisará adaptar 'getToolCatalogForUser' para retornar o formato que o SDK espera.
        const allToolsForCatalog = await ToolRegistryService.getToolCatalogForUser("weahter"); // Use um ID genérico ou adapte
        
        for (const tool of allToolsForCatalog) {
            console.log(`[MCP] Adicionando ferramenta: ${tool.title}`, tool.inputSchema.properties,z.object(tool.inputSchema.properties).pick({type: true}));
            
        const shape = Object.entries(tool.inputSchema.properties).reduce((acc, [key, prop]) => {
        
              // 4. Atribui o validador final, já configurado, ao nosso objeto 'shape'
        acc[key] = zodToRaw(prop);

        return acc;
      }, {});

            console.log("Propriedades da ferramenta:", shape);
            // Registra cada ferramenta no servidor MCP
            server.registerTool(tool.name, {
                title: tool.title,
                description: tool.description,
                inputSchema: shape,
                annotations: tool.annotations,
                outputSchema: tool.outputSchema 
            },
            // O handler da ferramenta (a função que será executada)
            async (params: any) => {
                try {
                            // Usamos um ID de utilizador "falso", mas válido, para a execução
                            console.log(`[MCP Routes] Executando a ferramenta ${tool.name} com parâmetros:`, params);
                            const result = await ToolRegistryService.executeTool('_system_', tool.name, params);
                            return result;
                        } catch (e) {
                            console.error(`[MCP Routes] Erro ao executar a ferramenta ${tool.name}:`, e);
                            // Retorna um erro formatado para o cliente
                            return { error: e instanceof Error ? e.message : 'Erro desconhecido.' };
                        }
            });
        }
        
        console.log("[MCP] Ferramentas registradas.");
        // Connect to the MCP server
        await server.connect(transport);
    } else {
        // Invalid request
        res.status(400).send({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided'
            },
            id: null
        });
        return;
    }

    // Handle the request
    await transport.handleRequest(req.raw, res.raw, req.body);
});;

const handleSessionRequest = async (req: FastifyRequest, res: FastifyReply) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    console.log(`[MCP] Manipulando requisição para a sessão MCP: ${sessionId}`);
    const transport = transports[sessionId];
    await transport.handleRequest(req.raw, res.raw);
};


    server.get("/", handleSessionRequest);
    server.delete("/", handleSessionRequest);
}