import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ToolRegistryService } from "../../../application/services/toolRegistry";
import { IMcpServer } from "../../repositories/mcp/IMcpServer";
import z from "zod";
import { zodToRaw } from "../../../shared/zod";

export class McpServerManager extends McpServer {
    
    constructor() {
        super({
            name: 'mcp-gateway',
            version: '1.0.0'
        });
        this.registerAllTools();
    }   
    
    private async registerAllTools() {
    

        console.log("[MCP Service] A registar ferramentas no servidor...");
        
        const allToolsForCatalog = await ToolRegistryService.getToolCatalogForUser("any_user");
        
        for (const tool of allToolsForCatalog) {
            const inputShape = Object.entries(tool.inputSchema.properties).reduce((acc, [key, prop]) => {
                acc[key] = zodToRaw(prop as any);
                return acc;
            }, {} as any);

            this.registerTool(tool.name, {
                title: tool.title,
                description: tool.description,
                inputSchema: inputShape,
                annotations: tool.annotations,
            },
            async (params: any) => {
                try {
                    console.log(`[MCP Service] A executar a ferramenta ${tool.name} com parâmetros:`, params);
                    const result = await ToolRegistryService.executeTool('_system_', tool.name, params);
                    return result;
                } catch (e) {
                    console.error(`[MCP Service] Erro ao executar a ferramenta ${tool.name}:`, e);
                    return { error: e instanceof Error ? e.message : 'Erro desconhecido.' };
                }
            });
        }
        
        
        console.log("[MCP Service] Ferramentas registadas com sucesso.");
    }


}