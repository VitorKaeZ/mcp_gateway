"use strict";
// packages/gateway/src/application/services/localToolClientManager.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalToolClientManager = void 0;
// import { StdioClient } from '@modelcontextprotocol/sdk';
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const path_1 = __importDefault(require("path"));
// Este mapa atuará como um cache para as instâncias de cliente.
const clients = new Map();
/**
 * Gerencia a criação e o acesso a clientes StdioClient para ferramentas locais.
 * Garante que apenas uma instância de processo seja criada por ferramenta.
 */
class LocalToolClientManager {
    /**
     * Obtém um cliente para um determinado script de ferramenta. Se o cliente
     * não existir, ele cria um novo processo e o armazena em cache.
     * @param toolPath O caminho relativo para o script da ferramenta (ex: 'local-tools/weather-tool/src/main.ts').
     */
    static async getClient(toolName, toolConfig) {
        // Resolve o caminho absoluto para garantir que funcione de qualquer lugar
        const absolutePath = path_1.default.resolve(process.cwd(), '..', toolConfig.location);
        if (!clients.has(absolutePath)) {
            console.log(`[ClientManager] Criando novo cliente stdio para ${toolConfig.name} em ${absolutePath}`);
            //   const client = new StdioClient({
            //     // O comando para executar nossa ferramenta TypeScript em desenvolvimento
            //     command: 'ts-node-dev',
            //     args: [absolutePath]
            //   });
            //   clients.set(absolutePath, client);
            const transport = new stdio_js_1.StdioClientTransport({
                command: "node",
                args: [absolutePath]
            });
            const client = new index_js_1.Client({
                name: toolConfig.name || "local-tool",
                version: "1.0.0"
            });
            await client.connect(transport);
            clients.set(absolutePath, client);
        }
        return clients.get(absolutePath);
    }
}
exports.LocalToolClientManager = LocalToolClientManager;
