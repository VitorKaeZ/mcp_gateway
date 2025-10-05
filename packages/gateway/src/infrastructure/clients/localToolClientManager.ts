


import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio'
import path from 'path'


const clients = new Map<string, Client>()


export class LocalToolClientManager {
  
  static async getClient(toolPath: string): Promise<Client> {
    const isDev = process.env.NODE_ENV === 'development'
    const resolvedPath = isDev
      ? toolPath
      : toolPath.replace('src/', 'build/').replace('.ts', '.js')
    const command = isDev ? 'ts-node-dev' : 'node'
    const absolutePath = path.resolve(process.cwd(), '..', resolvedPath)

    
    if (clients.has(absolutePath)) {
      return clients.get(absolutePath)!
    }

    console.log(
      `[ClientManager] Criando novo cliente stdio com o comando '${command}' para ${absolutePath}`,
    )

    
    const transport = new StdioClientTransport({
      command: command,
      args: [absolutePath],
       
    })

    
    const client = new Client({
      name: 'gateway-mcp-client', 
      version: '1.0.0',
    })

    
    
    await client.connect(transport)

    
    clients.set(absolutePath, client)

    return client
  }
}