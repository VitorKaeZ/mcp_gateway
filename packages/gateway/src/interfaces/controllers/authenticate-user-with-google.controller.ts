// src/application/controllers/authenticate-user-with-google.controller.ts

import { HttpRequest, HttpResponse } from "./ports/http";
import { badRequest, ok, serverError, unauthorized } from "./helpers/http.helpers";
import { AuthenticateUserWithGoogle } from "../../application/usecases/userLogin/login-user-with-oauth-on-service";

export class AuthenticateUserWithGoogleController {
  private readonly authenticateUserWithGoogle: AuthenticateUserWithGoogle;

  constructor(authenticateUserWithGoogle: AuthenticateUserWithGoogle) {
    this.authenticateUserWithGoogle = authenticateUserWithGoogle;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const { code } = httpRequest.query;

      if (!code) {
        return badRequest(new Error('Missing auth code.'));
      }

      const result = await this.authenticateUserWithGoogle.execute(code);

      if (result.isLeft()) {
        return unauthorized(result.value);
      }

      return ok(result.value);
    } catch (error) {
        console.log(error)
      return serverError('An internal server error occurred.');
    }
  }
}
