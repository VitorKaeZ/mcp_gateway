"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginUserWithOAuthController = void 0;
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const google_auth_service_1 = require("../../infrastructure/oauth/google-auth-service");
const login_user_with_oauth_on_service_1 = require("../../application/usecases/userLogin/login-user-with-oauth-on-service");
const authenticate_user_with_google_controller_1 = require("../../interfaces/controllers/authenticate-user-with-google.controller");
require("dotenv/config");
const makeLoginUserWithOAuthController = () => {
    const google_client_id = process.env.GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID';
    const google_secret_id = process.env.GOOGLE_SECRET_ID || 'SEU_CLIENT_SECRET';
    const googleOAuthService = new google_auth_service_1.GoogleOAuthService(google_client_id, google_secret_id, `http://localhost:${process.env.PORT}/auth/google/callback`);
    const prismaUserRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const authenticateUserWithGoogle = new login_user_with_oauth_on_service_1.AuthenticateUserWithGoogle(googleOAuthService, prismaUserRepository);
    const authenticateUserWithGoogleController = new authenticate_user_with_google_controller_1.AuthenticateUserWithGoogleController(authenticateUserWithGoogle);
    return authenticateUserWithGoogleController;
};
exports.makeLoginUserWithOAuthController = makeLoginUserWithOAuthController;
