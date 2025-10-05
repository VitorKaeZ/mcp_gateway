

import { database as prisma } from "../../infrastructure/database/prisma-client";
import { toolServerRegistry, toolPermissions, ToolConfig } from "../../config/tools.config";
import axios from 'axios';
import { LocalToolClientManager } from '../../infrastructure/clients/localToolClientManager'
import { Client } from "@modelcontextprotocol/sdk/client/index.js";


export class ToolRegistryService {

  
  public static async getToolCatalogForUser(userId: string): Promise<any[]> {
    
    

   const toolConfigs = toolServerRegistry;
  
    const allDiscoveredTools: any[] = [];

    for (const [toolName, config]of Object.entries(toolConfigs)) {
      try {
        let discoveredTools
        let tools
        if (config.type === 'http') {
          const response = await axios.get(`${config.location}`);
          console.log("response", response.data)
          discoveredTools = response.data;
        } else if (config.type === 'local') {
          const client = LocalToolClientManager.getClient(config.location);
        
          
          discoveredTools = await (await client).listTools();
        }
        console.log(`[ToolRegistry] Ferramentas descobertas de '${config.location}':`, discoveredTools);
          allDiscoveredTools.push(...discoveredTools.tools);
      } catch (error) {
        console.error(`[ToolRegistry] Falha ao descobrir ferramentas de '${config.location}':`, error);
        
      }
    }

    
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
          
          
          discoveredTools = []; 
        } else if (config.type === 'local') {
          
          discoveredTools = []; 
        } 
        console.log(`[ToolRegistry2] Ferramentas descobertas de '${config.location}':`, discoveredTools);
          allTools.push(...(discoveredTools ?? []));
      } catch (error) {
        console.error(`[ToolRegistry] Falha ao descobrir ferramentas de '${config.location}':`, error);
        
      }
    }

    return allTools;
  }
    

  
  public static async executeTool(userId: string, toolName: string, parameters: any) {
    
    

    
    
    
    

    const toolConfig = toolServerRegistry["Weather"];
    if (!toolConfig) {
      throw new Error(`A ferramenta '${toolName}' não está registada.`);
    }

    if (toolConfig.type === 'http') {
      const response = await axios.post(`${toolConfig.location}/execute`, { toolName, parameters });
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