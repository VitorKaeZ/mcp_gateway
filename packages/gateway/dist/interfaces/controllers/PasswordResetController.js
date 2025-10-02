"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetController = void 0;
const http_helpers_1 = require("./helpers/http.helpers");
const missing_params_error_1 = require("./errors/missing-params.error");
class PasswordResetController {
    constructor(passwordReset) {
        this.passwordReset = passwordReset;
    }
    async handle(httpRequest) {
        try {
            if (!httpRequest.body.token || !httpRequest.body.newPassword) {
                const field = !httpRequest.body.token ? 'token' : "password";
                return (0, http_helpers_1.badRequest)(new missing_params_error_1.MissingParamError(field));
            }
            const userData = { token: httpRequest.body.token, newPassword: httpRequest.body.newPassword };
            const passwordResetResponse = await this.passwordReset.passwordResetOnService(userData);
            if (passwordResetResponse.isLeft()) {
                return (0, http_helpers_1.unauthorized)(passwordResetResponse.value);
            }
            return (0, http_helpers_1.ok)(passwordResetResponse);
        }
        catch (error) {
            return (0, http_helpers_1.serverError)('An internal server error occurred.');
        }
    }
}
exports.PasswordResetController = PasswordResetController;
