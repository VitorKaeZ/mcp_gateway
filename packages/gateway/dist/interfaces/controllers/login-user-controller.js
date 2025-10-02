"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserController = void 0;
const http_helpers_1 = require("./helpers/http.helpers");
const missing_params_error_1 = require("./errors/missing-params.error");
class LoginUserController {
    constructor(loginUser) {
        this.loginUser = loginUser;
    }
    async handle(httpRequest) {
        try {
            if (!httpRequest.body.email || !httpRequest.body.password) {
                const field = !httpRequest.body.email ? 'email' : "password";
                return (0, http_helpers_1.badRequest)(new missing_params_error_1.MissingParamError(field));
            }
            const userData = { email: httpRequest.body.email, password: httpRequest.body.password };
            const loginUserResponse = await this.loginUser.loginUserOnService(userData);
            if (loginUserResponse.isLeft()) {
                return (0, http_helpers_1.unauthorized)(loginUserResponse.value);
            }
            return (0, http_helpers_1.ok)(loginUserResponse);
        }
        catch (error) {
            return (0, http_helpers_1.serverError)('An internal server error occurred.');
        }
    }
}
exports.LoginUserController = LoginUserController;
