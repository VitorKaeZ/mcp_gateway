"use strict";
// src/application/controllers/authenticate-user-with-google.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserWithGoogleController = void 0;
const http_helpers_1 = require("./helpers/http.helpers");
class AuthenticateUserWithGoogleController {
    constructor(authenticateUserWithGoogle) {
        this.authenticateUserWithGoogle = authenticateUserWithGoogle;
    }
    async handle(httpRequest) {
        try {
            const { code } = httpRequest.query;
            if (!code) {
                return (0, http_helpers_1.badRequest)(new Error('Missing auth code.'));
            }
            const result = await this.authenticateUserWithGoogle.execute(code);
            if (result.isLeft()) {
                return (0, http_helpers_1.unauthorized)(result.value);
            }
            return (0, http_helpers_1.ok)(result.value);
        }
        catch (error) {
            console.log(error);
            return (0, http_helpers_1.serverError)('An internal server error occurred.');
        }
    }
}
exports.AuthenticateUserWithGoogleController = AuthenticateUserWithGoogleController;
