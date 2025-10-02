"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const http_helpers_1 = require("./helpers/http.helpers");
const missing_params_error_1 = require("./errors/missing-params.error");
class RegisterUserController {
    constructor(registerUser) {
        this.registerUser = registerUser;
    }
    async handle(httpRequest) {
        try {
            if (!httpRequest.body.firstname || !httpRequest.body.lastname || !httpRequest.body.email || !httpRequest.body.password) {
                const requiredFields = ['firstname', 'lastname', 'email', 'password'];
                for (const field of requiredFields) {
                    if (!httpRequest.body[field]) {
                        return (0, http_helpers_1.badRequest)(new missing_params_error_1.MissingParamError(field));
                    }
                }
            }
            const userData = { firstname: httpRequest.body.firstname, lastname: httpRequest.body.lastname, email: httpRequest.body.email, password: httpRequest.body.password };
            const registerUserResponse = await this.registerUser.registerUserOnDatabase(userData);
            if (registerUserResponse.isLeft()) {
                return (0, http_helpers_1.badRequest)(registerUserResponse.value);
            }
            return (0, http_helpers_1.ok)(registerUserResponse.value);
        }
        catch (error) {
            return (0, http_helpers_1.serverError)('internal');
        }
    }
}
exports.RegisterUserController = RegisterUserController;
