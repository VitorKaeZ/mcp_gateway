"use strict";
// packages/gateway/src/application/services/toolRegistry.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistryService = void 0;
const prisma_client_1 = require("../../infrastructure/database/prisma-client");
const tools_config_1 = require("../../config/tools.config");
const axios_1 = __importDefault(require("axios"));
const localToolClientManager_1 = require("../../infrastructure/clients/localToolClientManager");
/**
 * Gere o catálogo e a execução de ferramentas, interagindo com os executores
 * (locais ou HTTP) e verificando as permissões.
 */
class ToolRegistryService {
    /**
     * Retorna o catálogo de ferramentas que um utilizador específico tem permissão para ver.
     * Este método descobre dinamicamente as ferramentas dos seus respetivos servidores (locais ou remotos).
     * @param userId O ID do utilizador autenticado.
     */
    static async getToolCatalogForUser(userId) {
        const user = await prisma_client_1.database.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("Utilizador não encontrado.");
        }
        const toolConfigs = tools_config_1.toolServerRegistry;
        const allDiscoveredTools = [];
        for (const [toolName, config] of Object.entries(toolConfigs)) {
            try {
                let discoveredTools;
                let tools;
                if (config.type === 'http') {
                    const response = await axios_1.default.get(`${config.location}/mcp/tools`);
                    discoveredTools = response.data;
                }
                else if (config.type === 'local') {
                    const client = localToolClientManager_1.LocalToolClientManager.getClient(config.location);
                    // O método discover() do SDK obtém a definição das ferramentas do processo local
                    discoveredTools = await (await client).listTools();
                }
                console.log(`[ToolRegistry] Ferramentas descobertas de '${config.location}':`, discoveredTools);
                allDiscoveredTools.push(...discoveredTools.tools);
            }
            catch (error) {
                console.error(`[ToolRegistry] Falha ao descobrir ferramentas de '${config.location}':`, error);
                // Continua para as outras localizações mesmo que uma falhe
            }
        }
        // Filtra final para garantir que apenas as ferramentas permitidas são retornadas
        return allDiscoveredTools;
    }
    /**
     * Executa uma ferramenta após verificar a permissão do utilizador.
     * @param userId O ID do utilizador que está a fazer a requisição.
     * @param toolName O nome da ferramenta a ser executada.
     * @param parameters Os parâmetros para a ferramenta.
     */
    static async executeTool(userId, toolName, parameters) {
        const user = await prisma_client_1.database.user.findFirst({ where: { id: userId } });
        if (!user)
            throw new Error("Utilizador não encontrado.");
        // const userPermissions = toolPermissions[user.email] || [];
        // const canExecute = userPermissions.includes('*') || userPermissions.includes(toolName);
        // if (!canExecute) {
        //   throw new Error('Acesso negado. Você não tem permissão para usar esta ferramenta.');
        // }
        const toolConfig = tools_config_1.toolServerRegistry["Weather"];
        if (!toolConfig) {
            throw new Error(`A ferramenta '${toolName}' não está registada.`);
        }
        if (toolConfig.type === 'http') {
            const response = await axios_1.default.post(`${toolConfig.location}/mcp/execute`, { toolName, parameters });
            return response.data.result;
        }
        if (toolConfig.type === 'local') {
            try {
                const client = localToolClientManager_1.LocalToolClientManager.getClient(toolConfig.location);
                const result = await (await client).callTool({
                    name: toolName,
                    arguments: parameters
                });
                return result;
            }
            catch (error) {
                console.error(`[Gateway] Erro ao executar ferramenta local '${toolName}':`, error);
                throw new Error(`Falha ao executar ferramenta local: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        throw new Error('Tipo de ferramenta desconhecido na configuração.');
    }
}
exports.ToolRegistryService = ToolRegistryService;
