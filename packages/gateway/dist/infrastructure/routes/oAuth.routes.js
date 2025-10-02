"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oAuthRoutes = oAuthRoutes;
const login_with_oauth_1 = require("../factories/login-with-oauth");
const fastify_route_adapter_1 = require("../adapters/fastify.route.adapter");
async function oAuthRoutes(fastify, options) {
    fastify.get('/google/callback', (0, fastify_route_adapter_1.adaptRoute)((0, login_with_oauth_1.makeLoginUserWithOAuthController)()));
    // Rota protegida (exemplo)
    fastify.get('/profile', async (request, reply) => {
        // Você pode verificar o token ou sessão aqui
        reply.send({ message: 'Perfil protegido!' });
    });
}
