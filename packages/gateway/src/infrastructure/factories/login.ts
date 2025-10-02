import { LoginUserController } from "../../interfaces/controllers/login-user-controller"
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository"
import { LoginUserOnService } from "../../application/usecases/userLogin/login-user-on-service"


export const makeLoginUserController = (): LoginUserController => {
    const prismaUserRepository = new PrismaUserRepository()
    const loginUserOnService = new LoginUserOnService(prismaUserRepository)
    const loginUserController = new LoginUserController(loginUserOnService)
    
    return loginUserController
}