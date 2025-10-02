import { RegisterUserController } from "../../interfaces/controllers/register-user-controller"
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository"
import { RegisterUserOnDatabase } from "../../application/usecases/userRegister/register-user-on-database"
import { PasswordResetController } from "../../interfaces/controllers/PasswordResetController"
import { PrismaPasswordResetRepository } from "../../infrastructure/repositories/PrismaPasswordResetRepository"
import { ResetPassword } from "../../application/usecases/passwordReset/passwordResetOnService"


export const makePasswordResetController = (): PasswordResetController => {
    const prismaUserRepository = new PrismaUserRepository()
    const prismaPasswordResetRepository = new PrismaPasswordResetRepository()
    const passwordResetrOnDatabase = new ResetPassword(prismaUserRepository, prismaPasswordResetRepository)
    const passwordResetController = new PasswordResetController(passwordResetrOnDatabase)
    
    return passwordResetController
}