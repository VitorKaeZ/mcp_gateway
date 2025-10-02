"use strict";
// src/application/usecases/oauth/authenticate-user-with-google.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserWithGoogle = void 0;
const either_1 = require("../../../shared/either");
const invalid_oauth_token_error_1 = require("../../../core/entities/user/errors/invalid-oauth-token.error");
class AuthenticateUserWithGoogle {
    constructor(oAuthService, userRepository) {
        this.oAuthService = oAuthService;
        this.userRepository = userRepository;
    }
    async execute(authCode) {
        try {
            const token = await this.oAuthService.getAccessToken(authCode);
            if (!token) {
                return (0, either_1.left)(new invalid_oauth_token_error_1.InvalidOAuthTokenError());
            }
            const userInfo = await this.oAuthService.getUserInfo(token);
            let user = await this.userRepository.findUserByGoogleId(userInfo.id);
            if (!user) {
                await this.userRepository.add({
                    googleId: userInfo.id,
                    email: userInfo.email || "",
                    firstname: userInfo.firstname || "",
                    lastname: userInfo.lastname || "",
                });
            }
            return (0, either_1.right)(userInfo);
        }
        catch (error) {
            console.log(error);
            return (0, either_1.left)(new invalid_oauth_token_error_1.InvalidOAuthTokenError());
        }
    }
}
exports.AuthenticateUserWithGoogle = AuthenticateUserWithGoogle;
