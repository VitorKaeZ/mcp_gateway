import { RegisterUserController } from '../../interfaces/controllers/register-user-controller'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { HttpRequest } from '../../interfaces/controllers/ports/http'
import { LoginUserController } from '../../interfaces/controllers/login-user-controller';
import { PasswordResetController } from '../../interfaces/controllers/PasswordResetController';
import { RequestPasswordResetController } from '../../interfaces/controllers/RequestPasswordResetController';
import { AuthenticateUserWithGoogleController } from '../../interfaces/controllers/authenticate-user-with-google.controller';
import { HandlePostController } from '../../interfaces/controllers/mcp/HandlePostController';


export const adaptRoute = (controller: RegisterUserController | LoginUserController | PasswordResetController | RequestPasswordResetController | AuthenticateUserWithGoogleController | HandlePostController ) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
      query: req.query,
      body: req.body,
      params: req.params,
      raw: req.raw,
      reply: reply
    }
    const httpResponse = await controller.handle(httpRequest)

    if (reply.sent) {
      return;
    }
    
    reply.status(httpResponse.statusCode).send(httpResponse.body)
  }
}