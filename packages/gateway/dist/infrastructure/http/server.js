"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpServer = createHttpServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("../routes/routes");
const user_routes_1 = require("../routes/user.routes");
const oauth2_1 = __importDefault(require("@fastify/oauth2"));
const oAuth_routes_1 = require("../routes/oAuth.routes");
const mcp_routes_1 = require("../routes/mcp.routes"); // <--- IMPORTE AQUI
const googleOAuth2Options = {
    name: 'googleOAuth2',
    credentials: {
        client: {
            id: process.env.GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID',
            secret: process.env.GOOGLE_SECRET_ID || 'SEU_CLIENT_SECRET',
        },
        auth: oauth2_1.default.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `http://localhost:${process.env.PORT}/auth/google/callback`, // URL de redirecionamento
    scope: ['openid', 'profile', 'email'], // Adicione os escopos necessários
};
function createHttpServer() {
    const server = (0, fastify_1.default)();
    server.register(cors_1.default);
    server.register(routes_1.routes);
    server.register(user_routes_1.userRoutes, {
        prefix: '/users',
    });
    server.register(oauth2_1.default, googleOAuth2Options);
    server.register(oAuth_routes_1.oAuthRoutes, {
        prefix: '/auth',
    });
    // Registra as rotas de usuário e autenticação já existentes
    // Registra nossas novas rotas do Gateway MCP
    server.register(mcp_routes_1.mcpRoutes, { prefix: '/mcp' }); // <--- REGISTRE AQUI
    server.get("/health", (req, res) => {
        res.status(200).send("OK");
    });
    return server;
}
