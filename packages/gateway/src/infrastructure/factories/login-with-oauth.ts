import { LoginUserController } from "../../interfaces/controllers/login-user-controller"
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository"
import { LoginUserOnService } from "../../application/usecases/userLogin/login-user-on-service"
import { GoogleOAuthService } from "../../infrastructure/oauth/google-auth-service";
import { AuthenticateUserWithGoogle } from "../../application/usecases/userLogin/login-user-with-oauth-on-service";
import { AuthenticateUserWithGoogleController } from "../../interfaces/controllers/authenticate-user-with-google.controller";
import "dotenv/config"


export const makeLoginUserWithOAuthController = (): AuthenticateUserWithGoogleController => {
    const google_client_id = process.env.GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID'
    const google_secret_id = process.env.GOOGLE_SECRET_ID || 'SEU_CLIENT_SECRET'
    const googleOAuthService = new GoogleOAuthService(google_client_id, google_secret_id , `http://localhost:${process.env.PORT}/auth/google/callback`);
    const prismaUserRepository = new PrismaUserRepository()

    const authenticateUserWithGoogle = new AuthenticateUserWithGoogle(googleOAuthService, prismaUserRepository);
    const authenticateUserWithGoogleController = new AuthenticateUserWithGoogleController(authenticateUserWithGoogle);
    
    return authenticateUserWithGoogleController
}