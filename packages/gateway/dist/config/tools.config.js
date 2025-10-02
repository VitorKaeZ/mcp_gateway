"use strict";
// packages/gateway/src/config/tools.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolPermissions = exports.toolServerRegistry = void 0;
/**
 * ==============================================================================
 * REGISTO CENTRAL DE FERRAMENTAS
 * ==============================================================================
 * Mapeia os NOMES das ferramentas para a sua configuração de execução.
 * Este é o "catálogo" que o gateway usa para saber como invocar cada ferramenta.
 */
exports.toolServerRegistry = {
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
exports.toolPermissions = {
    // O utilizador 'admin@example.com' tem acesso a todas as ferramentas registadas.
    // O '*' é um wildcard que concede acesso total.
    "admin@example.com": ["*"],
    // O utilizador 'test@example.com' só pode usar a ferramenta de clima.
    "test@example.com": ["Weather"],
    // O utilizador 'trader@example.com' só pode usar a ferramenta de cotações.
    "trader@example.com": ["stockPrice"],
};
