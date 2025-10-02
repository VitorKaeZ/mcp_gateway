import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { adaptRoute } from "../adapters/fastify.route.adapter";
import { makeRegisterUserController } from "../factories/register";
import authenticateJwt from "../middlewares/auth-middleware";
import { makeLoginUserController } from "../factories/login";
import { makePasswordResetController } from "../factories/passwordReset";
import { makeRequestPasswordResetController } from "../factories/requestPasswordReset";

export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

    fastify.get("/", { preHandler: [authenticateJwt(), ] }, async (request: FastifyRequest, reply: FastifyReply) => {
        return { ok: true }
    })
    fastify.post("/login", adaptRoute(makeLoginUserController()))
    fastify.post("/signup", adaptRoute(makeRegisterUserController()))

    fastify.post("/request-password-reset", adaptRoute(makeRequestPasswordResetController()))
    fastify.post("/reset-password", adaptRoute(makePasswordResetController()))
}