import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ToolRegistryService } from "../../../application/services/toolRegistry";
import { IMcpServer } from "../../repositories/mcp/IMcpServer";
import z from "zod";
import { zodToRaw } from "../../../shared/zod";
import { Client } from "@modelcontextprotocol/sdk/client";

export class McpClientManager extends Client {
    private toolService: ToolRegistryService;
    constructor(private toolService: ToolRegistryService) {
        super({
            name: 'mcp-gateway-client',
            version: '1.0.0'
        });
        this.getAllTools();
    }

    private getAllTools() {
        const allToolsForCatalog = this.toolService.getAllToolsForCatalog();
        for (const tool of allToolsForCatalog) {
            console.log(`[MCP Client] Adicionando ferramenta: ${tool.title}`, tool.inputSchema.properties);    

}