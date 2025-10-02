// packages/gateway/src/config/tools.config.ts

/**
 * Define a estrutura para a configuração de uma ferramenta.
 * Cada ferramenta pode ser de um tipo diferente, com uma localização específica.
 */
export interface ToolConfig {
  /**
   * O tipo de executor para a ferramenta.
   * - 'http': A ferramenta é um servidor MCP externo acessível via HTTP.
   * - 'local': A ferramenta é um script local executado como um processo filho via stdio.
   */
  type: 'http' | 'local';

  /**
   * Onde encontrar a ferramenta.
   * - Para 'http', esta é a URL base do servidor MCP (ex: 'http://localhost:3001').
   * - Para 'local', este é o caminho relativo para o script executável a partir da raiz do monorepo (ex: 'packages/local-tools/weather-tool/src/main.ts').
   */
  location: string;
}

/**
 * ==============================================================================
 * REGISTO CENTRAL DE FERRAMENTAS
 * ==============================================================================
 * Mapeia os NOMES das ferramentas para a sua configuração de execução.
 * Este é o "catálogo" que o gateway usa para saber como invocar cada ferramenta.
 */
export const toolServerRegistry: { [toolName: string]: ToolConfig } = {
  // Exemplo de uma ferramenta local que roda via stdio.
  // O gateway irá iniciar e gerir o processo para esta ferramenta.
  "Weather": {
    type: 'local',
    location: 'tools/weather/build/main.js'
  },

  // Exemplo de uma ferramenta externa que é um servidor HTTP independente.
  // O gateway atuará como um proxy para este endereço.
//   "stockPrive": {
//       type: 'http',
//       location: 'http://localhost:3002'
//   },
    
  // Adicione outras ferramentas aqui conforme necessário.
  // "anotherLocalTool": {
  //   type: 'local',
  //   location: 'packages/local-tools/another-tool/src/main.ts'
  // },
};


/**
 * ==============================================================================
 * MAPEAMENTO DE PERMISSÕES
 * ==============================================================================
 * Define quais utilizadores (identificados pelo seu email) podem aceder a quais ferramentas.
 * Este é o núcleo da camada de governança e autorização do gateway.
 */
export const toolPermissions: { [userEmail: string]: string[] } = {
  // O utilizador 'admin@example.com' tem acesso a todas as ferramentas registadas.
  // O '*' é um wildcard que concede acesso total.
  "admin@example.com": ["*"],

  // O utilizador 'test@example.com' só pode usar a ferramenta de clima.
  "test@example.com": ["Weather"],

  // O utilizador 'trader@example.com' só pode usar a ferramenta de cotações.
  "trader@example.com": ["stockPrice"],
};