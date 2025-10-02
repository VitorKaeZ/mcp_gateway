import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { makeLoginUserWithOAuthController } from "../factories/login-with-oauth";
import { AuthenticateUserWithGoogle } from "../../application/usecases/userLogin/login-user-with-oauth-on-service";
import { adaptRoute } from "../adapters/fastify.route.adapter";

export async function oAuthRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  

    fastify.get('/google/callback', adaptRoute(makeLoginUserWithOAuthController()))
      
      // Rota protegida (exemplo)
      fastify.get('/profile', async (request, reply) => {
        // Você pode verificar o token ou sessão aqui
        reply.send({ message: 'Perfil protegido!' });
      });
}