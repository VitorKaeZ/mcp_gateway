"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetController = void 0;
const http_helpers_1 = require("./helpers/http.helpers");
const missing_params_error_1 = require("./errors/missing-params.error");
class RequestPasswordResetController {
    constructor(passwordReset) {
        this.reqPasswordReset = passwordReset;
    }
    async handle(httpRequest) {
        try {
            if (!httpRequest.body.email) {
                return (0, http_helpers_1.badRequest)(new missing_params_error_1.MissingParamError('email'));
            }
            const userData = { email: httpRequest.body.email };
            const passwordResetResponse = await this.reqPasswordReset.reqPasswordResetOnService(userData);
            if (passwordResetResponse.isLeft()) {
                return (0, http_helpers_1.unauthorized)(passwordResetResponse.value);
            }
            return (0, http_helpers_1.ok)(passwordResetResponse);
        }
        catch (error) {
            console.log(error);
            return (0, http_helpers_1.serverError)('An internal server error occurred.');
        }
    }
}
exports.RequestPasswordResetController = RequestPasswordResetController;
