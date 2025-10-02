"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
async function routes(fastify, options) {
    fastify.get("/", async (request, reply) => {
        return { ok: true };
    });
}
