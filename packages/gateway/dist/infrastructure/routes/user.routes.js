"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const fastify_route_adapter_1 = require("../adapters/fastify.route.adapter");
const register_1 = require("../factories/register");
const auth_middleware_1 = __importDefault(require("../middlewares/auth-middleware"));
const login_1 = require("../factories/login");
const passwordReset_1 = require("../factories/passwordReset");
const requestPasswordReset_1 = require("../factories/requestPasswordReset");
async function userRoutes(fastify, options) {
    fastify.get("/", { preHandler: [(0, auth_middleware_1.default)(),] }, async (request, reply) => {
        return { ok: true };
    });
    fastify.post("/login", (0, fastify_route_adapter_1.adaptRoute)((0, login_1.makeLoginUserController)()));
    fastify.post("/signup", (0, fastify_route_adapter_1.adaptRoute)((0, register_1.makeRegisterUserController)()));
    fastify.post("/request-password-reset", (0, fastify_route_adapter_1.adaptRoute)((0, requestPasswordReset_1.makeRequestPasswordResetController)()));
    fastify.post("/reset-password", (0, fastify_route_adapter_1.adaptRoute)((0, passwordReset_1.makePasswordResetController)()));
}
