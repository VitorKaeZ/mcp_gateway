
import { HttpRequest, HttpResponse } from "./ports/http";
import { badRequest, ok, serverError, unauthorized } from "./helpers/http.helpers";
import { MissingParamError } from "./errors/missing-params.error";
import { LoginUser, LoginUserResponse } from "../../application/usecases/userLogin/login-user";
import { UserDataLoginRequest } from "../../core/entities/user/user-data";
import { PasswordReset, PasswordResetInterface, PasswordResetResponse } from "../../application/usecases/passwordReset/passwordReset";

export class PasswordResetController {

    private readonly passwordReset: PasswordReset

    constructor (passwordReset: PasswordReset) {
        this.passwordReset = passwordReset
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            
        try {
            if ( !httpRequest.body.token || !httpRequest.body.newPassword) {
                const field = !httpRequest.body.token ? 'token' : "password"
                
                return badRequest(new MissingParamError(field));
            }

            const userData: PasswordResetInterface = { token : httpRequest.body.token, newPassword : httpRequest.body.newPassword}
            const passwordResetResponse: PasswordResetResponse = await this.passwordReset.passwordResetOnService(userData)

            if (passwordResetResponse.isLeft()) {
                return unauthorized(passwordResetResponse.value)
            }
            
            return ok(passwordResetResponse)
        } catch (error) {
            return serverError('An internal server error occurred.')
        }
    }
}

