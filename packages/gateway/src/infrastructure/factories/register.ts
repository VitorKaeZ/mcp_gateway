import { RegisterUserController } from "../../interfaces/controllers/register-user-controller"
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository"
import { RegisterUserOnDatabase } from "../../application/usecases/userRegister/register-user-on-database"


export const makeRegisterUserController = (): RegisterUserController => {
    const prismaUserRepository = new PrismaUserRepository()
    const registerUserOnDatabase = new RegisterUserOnDatabase(prismaUserRepository)
    const registerUserController = new RegisterUserController(registerUserOnDatabase)
    
    return registerUserController
}