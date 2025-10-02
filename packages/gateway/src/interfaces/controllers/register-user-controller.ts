import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUserResponse } from "../../application/usecases/userRegister/register-user";
import { HttpRequest, HttpResponse } from "./ports/http";
import { badRequest, ok, serverError } from "./helpers/http.helpers";
import { MissingParamError } from "./errors/missing-params.error";
import { RegisterUser } from "../../application/usecases/userRegister/register-user";

export class RegisterUserController {

    private readonly registerUser: RegisterUser

    constructor (registerUser: RegisterUser) {
        this.registerUser = registerUser
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            if (!httpRequest.body.firstname || !httpRequest.body.lastname || !httpRequest.body.email || !httpRequest.body.password) {
                const requiredFields = ['firstname', 'lastname', 'email', 'password'];

                for (const field of requiredFields) {
                    if (!httpRequest.body[field]) {
                        return badRequest(new MissingParamError(field));
                    }
                }
            }

            const userData = { firstname : httpRequest.body.firstname, lastname : httpRequest.body.lastname, email : httpRequest.body.email, password : httpRequest.body.password}
            const registerUserResponse: RegisterUserResponse = await this.registerUser.registerUserOnDatabase(userData)

            if (registerUserResponse.isLeft()) {
                return badRequest(registerUserResponse.value)
            }
            
            return ok(registerUserResponse.value)
        } catch (error) {
            return serverError('internal')
        }
    }
}

