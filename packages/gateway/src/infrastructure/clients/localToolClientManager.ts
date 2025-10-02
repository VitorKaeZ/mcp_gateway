// packages/gateway/src/infrastructure/clients/localToolClientManager.ts

// Importações atualizadas para seguir o novo padrão do SDK
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio'
import path from 'path'

// A cache agora irá armazenar as instâncias do 'Client' genérico, que já estarão conectadas.
const clients = new Map<string, Client>()

/**
 * Gere a criação, conexão e acesso a clientes MCP para ferramentas locais.
 * Garante que apenas uma instância de processo seja criada e conectada por ferramenta.
 */
export class LocalToolClientManager {
  /**
   * Obtém um cliente conectado para um determinado script de ferramenta.
   * Se o cliente não existir, ele cria um novo processo, conecta-se a ele e armazena-o em cache.
   * @param toolPath O caminho relativo para o script da ferramenta (ex: 'packages/tools/weather/src/main.ts').
   */
  static async getClient(toolPath: string): Promise<Client> {
    const isDev = process.env.NODE_ENV === 'development'
    const resolvedPath = isDev
      ? toolPath
      : toolPath.replace('src/', 'build/').replace('.ts', '.js')
    const command = isDev ? 'ts-node-dev' : 'node'
    const absolutePath = path.resolve(process.cwd(), '..', resolvedPath)

    // Se já tivermos um cliente conectado em cache, retornamo-lo imediatamente.
    if (clients.has(absolutePath)) {
      return clients.get(absolutePath)!
    }

    console.log(
      `[ClientManager] Criando novo cliente stdio com o comando '${command}' para ${absolutePath}`,
    )

    // 1. Criamos o Transporte, que sabe como iniciar e comunicar com o processo.
    const transport = new StdioClientTransport({
      command: command,
      args: [absolutePath],
       
    })

    // 2. Criamos o Cliente genérico.
    const client = new Client({
      name: 'gateway-mcp-client', // Nome do nosso cliente
      version: '1.0.0',
    })

    // 3. Conectamos o cliente ao transporte. Esta é uma operação assíncrona.
    // O cliente está agora "vivo" e pronto para receber comandos.
    await client.connect(transport)

    // 4. Armazenamos o cliente conectado na cache para reutilização.
    clients.set(absolutePath, client)

    return client
  }
}