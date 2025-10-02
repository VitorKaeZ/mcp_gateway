"use strict";
// packages/gateway/src/infrastructure/clients/localToolClientManager.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalToolClientManager = void 0;
// Importações atualizadas para seguir o novo padrão do SDK
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_1 = require("@modelcontextprotocol/sdk/client/stdio");
const path_1 = __importDefault(require("path"));
// A cache agora irá armazenar as instâncias do 'Client' genérico, que já estarão conectadas.
const clients = new Map();
/**
 * Gere a criação, conexão e acesso a clientes MCP para ferramentas locais.
 * Garante que apenas uma instância de processo seja criada e conectada por ferramenta.
 */
class LocalToolClientManager {
    /**
     * Obtém um cliente conectado para um determinado script de ferramenta.
     * Se o cliente não existir, ele cria um novo processo, conecta-se a ele e armazena-o em cache.
     * @param toolPath O caminho relativo para o script da ferramenta (ex: 'packages/tools/weather/src/main.ts').
     */
    static async getClient(toolPath) {
        const isDev = process.env.NODE_ENV === 'development';
        const resolvedPath = isDev
            ? toolPath
            : toolPath.replace('src/', 'build/').replace('.ts', '.js');
        const command = isDev ? 'ts-node-dev' : 'node';
        const absolutePath = path_1.default.resolve(process.cwd(), '..', resolvedPath);
        // Se já tivermos um cliente conectado em cache, retornamo-lo imediatamente.
        if (clients.has(absolutePath)) {
            return clients.get(absolutePath);
        }
        console.log(`[ClientManager] Criando novo cliente stdio com o comando '${command}' para ${absolutePath}`);
        // 1. Criamos o Transporte, que sabe como iniciar e comunicar com o processo.
        const transport = new stdio_1.StdioClientTransport({
            command: command,
            args: [absolutePath],
        });
        // 2. Criamos o Cliente genérico.
        const client = new index_js_1.Client({
            name: 'gateway-mcp-client', // Nome do nosso cliente
            version: '1.0.0',
        });
        // 3. Conectamos o cliente ao transporte. Esta é uma operação assíncrona.
        // O cliente está agora "vivo" e pronto para receber comandos.
        await client.connect(transport);
        // 4. Armazenamos o cliente conectado na cache para reutilização.
        clients.set(absolutePath, client);
        return client;
    }
}
exports.LocalToolClientManager = LocalToolClientManager;
