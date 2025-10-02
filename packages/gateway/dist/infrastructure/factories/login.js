"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginUserController = void 0;
const login_user_controller_1 = require("../../interfaces/controllers/login-user-controller");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const login_user_on_service_1 = require("../../application/usecases/userLogin/login-user-on-service");
const makeLoginUserController = () => {
    const prismaUserRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const loginUserOnService = new login_user_on_service_1.LoginUserOnService(prismaUserRepository);
    const loginUserController = new login_user_controller_1.LoginUserController(loginUserOnService);
    return loginUserController;
};
exports.makeLoginUserController = makeLoginUserController;
