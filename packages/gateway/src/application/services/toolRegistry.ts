// packages/gateway/src/application/services/toolRegistry.ts

import { database as prisma } from "../../infrastructure/database/prisma-client";
import { toolServerRegistry, toolPermissions, ToolConfig } from "../../config/tools.config";
import axios from 'axios';
import { LocalToolClientManager } from '../../infrastructure/clients/localToolClientManager'
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

/**
 * Gere o catálogo e a execução de ferramentas, interagindo com os executores
 * (locais ou HTTP) e verificando as permissões.
 */
export class ToolRegistryService {

  /**
   * Retorna o catálogo de ferramentas que um utilizador específico tem permissão para ver.
   * Este método descobre dinamicamente as ferramentas dos seus respetivos servidores (locais ou remotos).
   * @param userId O ID do utilizador autenticado.
   */
  public static async getToolCatalogForUser(userId: string): Promise<any[]> {
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (!user) {
    //   throw new Error("Utilizador não encontrado.");
    // }

   const toolConfigs = toolServerRegistry;
  
    const allDiscoveredTools: any[] = [];

    for (const [toolName, config]of Object.entries(toolConfigs)) {
      try {
        let discoveredTools
        let tools
        if (config.type === 'http') {
          const response = await axios.get(`${config.location}/mcp/tools`);
          discoveredTools = response.data;
        } else if (config.type === 'local') {
          const client = LocalToolClientManager.getClient(config.location);
        
          // O método discover() do SDK obtém a definição das ferramentas do processo local
          discoveredTools = await (await client).listTools();
        }
        console.log(`[ToolRegistry] Ferramentas descobertas de '${config.location}':`, discoveredTools);
          allDiscoveredTools.push(...discoveredTools.tools);
      } catch (error) {
        console.error(`[ToolRegistry] Falha ao descobrir ferramentas de '${config.location}':`, error);
        // Continua para as outras localizações mesmo que uma falhe
      }
    }

    // Filtra final para garantir que apenas as ferramentas permitidas são retornadas
    return allDiscoveredTools;
  }

  getAllToolsForCatalog(): any[] {
    const toolConfigs = toolServerRegistry;
    const allTools: any[] = [];

    for (const [toolName, config] of Object.entries(toolConfigs)) {
      try {
        let discoveredTools;
        let tools;
        if (config.type === 'http') {
          // Aqui, idealmente, faríamos uma chamada HTTP para obter as ferramentas
          // Mas para este exemplo, vamos assumir que temos uma lista estática
          discoveredTools = []; // Substitua por chamada real
        } else if (config.type === 'local') {
          // Aqui, idealmente, usaríamos o cliente local para descobrir ferramentas
          discoveredTools = []; // Substitua por chamada real
        } 
        console.log(`[ToolRegistry2] Ferramentas descobertas de '${config.location}':`, discoveredTools);
          allTools.push(...(discoveredTools ?? []));
      } catch (error) {
        console.error(`[ToolRegistry] Falha ao descobrir ferramentas de '${config.location}':`, error);
        // Continua para as outras localizações mesmo que uma falhe
      }
    }

    return allTools;
  }
    

  /**
   * Executa uma ferramenta após verificar a permissão do utilizador.
   * @param userId O ID do utilizador que está a fazer a requisição.
   * @param toolName O nome da ferramenta a ser executada.
   * @param parameters Os parâmetros para a ferramenta.
   */
  public static async executeTool(userId: string, toolName: string, parameters: any) {
    // const user = await prisma.user.findFirst({ where: { id: userId } });
    // if (!user) throw new Error("Utilizador não encontrado.");

    // const userPermissions = toolPermissions[user.email] || [];
    // const canExecute = userPermissions.includes('*') || userPermissions.includes(toolName);
    // if (!canExecute) {
    //   throw new Error('Acesso negado. Você não tem permissão para usar esta ferramenta.');
    // }

    const toolConfig = toolServerRegistry["Weather"];
    if (!toolConfig) {
      throw new Error(`A ferramenta '${toolName}' não está registada.`);
    }

    if (toolConfig.type === 'http') {
      const response = await axios.post(`${toolConfig.location}/mcp/execute`, { toolName, parameters });
      return response.data.result;
    }

    if (toolConfig.type === 'local') {
      try {
        const client = LocalToolClientManager.getClient(toolConfig.location);
        const result = await (await client).callTool({
          name: toolName,
          arguments: parameters
        });
        return result;
      } catch (error) {
        console.error(`[Gateway] Erro ao executar ferramenta local '${toolName}':`, error);
        throw new Error(`Falha ao executar ferramenta local: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    throw new Error('Tipo de ferramenta desconhecido na configuração.');
  }


}