// packages/gateway/src/infrastructure/routes/mcp.routes.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ToolRegistryService } from '../../application/services/toolRegistry';
import authenticateJwt from '../middlewares/auth-middleware';

/**
 * Regista as rotas do Model Context Protocol (MCP) no servidor Fastify.
 * Estas rotas são o ponto de entrada para clientes de IA interagirem com as ferramentas.
 *
 * @param server A instância do servidor Fastify.
 */
export const mcpRoutes = async (server: FastifyInstance) => {

  // Hook de pré-tratamento (preHandler) que aplica o nosso middleware de autenticação
  // a TODAS as rotas definidas neste ficheiro. Nenhuma rota MCP pode ser acedida
  // sem um token de autenticação válido.
  server.addHook('preHandler', authenticateJwt());

  /**
   * Endpoint de Descoberta de Ferramentas (GET /mcp/tools)
   * * Um cliente de IA chama este endpoint para descobrir quais ferramentas estão
   * disponíveis para o utilizador autenticado. A lista de ferramentas é filtrada
   * com base nas permissões definidas no ficheiro de configuração.
   */
  server.get('/tools', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // O middleware de autenticação já validou o token e adicionou 'userId' ao objeto 'request'.
      // Afirmamos o tipo para garantir a segurança de tipos do TypeScript.
      const userId = (request as any).headers['user-id'];

      // Delegamos a lógica de negócio para o serviço de registo de ferramentas.
      const catalog = await ToolRegistryService.getToolCatalogForUser(userId);
      
      reply.status(200).send(catalog);
    } catch (error) {
      console.error("[MCP Routes] Erro ao obter o catálogo de ferramentas:", error);
      reply.status(500).send({ error: 'Falha ao obter o catálogo de ferramentas.' });
    }
  });

  /**
   * Endpoint de Execução de Ferramentas (POST /mcp/execute)
   * * Um cliente de IA chama este endpoint para executar uma ferramenta específica
   * com um conjunto de parâmetros. O serviço irá verificar novamente as permissões
   * antes de executar a ferramenta (seja localmente ou via proxy).
   */
  server.post('/execute', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).userId;
      const { toolName, parameters } = request.body as { toolName: string; parameters: any };

      // Validação básica da entrada
      if (!toolName) {
        return reply.status(400).send({ error: 'O campo "toolName" é obrigatório.' });
      }

      // Delegamos a lógica de execução e verificação de permissões para o serviço.
      const result = await ToolRegistryService.executeTool(userId, toolName, parameters);
      
      reply.status(200).send({ success: true, result });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Um erro desconhecido ocorreu';
      console.error(`[MCP Routes] Erro ao executar a ferramenta '${(request.body as any)?.toolName}':`, errorMessage);

      // Tratamento de erros específico para fornecer feedback claro ao cliente.
      if (errorMessage.includes('Acesso negado')) {
        reply.status(403).send({ success: false, error: errorMessage }); // 403 Forbidden
      } else if (errorMessage.includes('não encontrada') || errorMessage.includes('não está registrada')) {
        reply.status(404).send({ success: false, error: errorMessage }); // 404 Not Found
      } else {
        reply.status(500).send({ success: false, error: errorMessage }); // 500 Internal Server Error
      }
    }
  });
};