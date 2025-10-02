import { RegisterUserController } from "../../interfaces/controllers/register-user-controller"
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository"
import { RegisterUserOnDatabase } from "../../application/usecases/userRegister/register-user-on-database"
import { PasswordResetController } from "../../interfaces/controllers/PasswordResetController"
import { PrismaPasswordResetRepository } from "../../infrastructure/repositories/PrismaPasswordResetRepository"
import { ResetPassword } from "../../application/usecases/passwordReset/passwordResetOnService"
import { RequestPasswordResetController } from "../../interfaces/controllers/RequestPasswordResetController"
import { RequestPasswordReset } from "../../application/usecases/passwordReset/requestPasswordResetOnService"
import { NodeMailerService } from "../../infrastructure/email/NodeMailerService"


export const makeRequestPasswordResetController = (): RequestPasswordResetController => {
    const prismaUserRepository = new PrismaUserRepository()
    const prismaPasswordResetRepository = new PrismaPasswordResetRepository()
    const emailService = new NodeMailerService()
    const passwordResetrOnDatabase = new RequestPasswordReset(prismaUserRepository, prismaPasswordResetRepository, emailService)
    const passwordResetController = new RequestPasswordResetController(passwordResetrOnDatabase)
    
    return passwordResetController
}