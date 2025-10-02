import { RegisterUserController } from '../../interfaces/controllers/register-user-controller'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { HttpRequest } from '../../interfaces/controllers/ports/http'
import { LoginUserController } from '../../interfaces/controllers/login-user-controller';
import { PasswordResetController } from '../../interfaces/controllers/PasswordResetController';
import { RequestPasswordResetController } from '../../interfaces/controllers/RequestPasswordResetController';
import { AuthenticateUserWithGoogleController } from '../../interfaces/controllers/authenticate-user-with-google.controller';

export const adaptRoute = (controller: RegisterUserController | LoginUserController | PasswordResetController | RequestPasswordResetController | AuthenticateUserWithGoogleController ) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const httpRequest: HttpRequest = {
      query: req.query,
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    reply.status(httpResponse.statusCode).send(httpResponse.body)
  }
}
