
import { HttpRequest, HttpResponse } from "./ports/http";
import { badRequest, ok, serverError, unauthorized } from "./helpers/http.helpers";
import { MissingParamError } from "./errors/missing-params.error";
import { LoginUser, LoginUserResponse } from "../../application/usecases/userLogin/login-user";
import { UserDataLoginRequest } from "../../core/entities/user/user-data";
import { PasswordReset, PasswordResetInterface, PasswordResetResponse } from "../../application/usecases/passwordReset/passwordReset";
import { ReqPasswordResetResponse, RequestPasswordReset, RequestPasswordResetInterface } from "../../application/usecases/passwordReset/requestPasswordReset";

export class RequestPasswordResetController {

    private readonly reqPasswordReset: RequestPasswordReset

    constructor (passwordReset: RequestPasswordReset) {
        this.reqPasswordReset = passwordReset
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            
        try {
            if ( !httpRequest.body.email ) {
                
                
                return badRequest(new MissingParamError('email'));
            }

            const userData: RequestPasswordResetInterface = { email : httpRequest.body.email }
            const passwordResetResponse: ReqPasswordResetResponse = await this.reqPasswordReset.reqPasswordResetOnService(userData)

            if (passwordResetResponse.isLeft()) {
                return unauthorized(passwordResetResponse.value)
            }
            
            return ok(passwordResetResponse)
        } catch (error) {
            console.log(error)
            return serverError('An internal server error occurred.')
        }
    }
}

