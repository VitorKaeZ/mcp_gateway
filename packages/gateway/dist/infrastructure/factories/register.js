"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRegisterUserController = void 0;
const register_user_controller_1 = require("../../interfaces/controllers/register-user-controller");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const register_user_on_database_1 = require("../../application/usecases/userRegister/register-user-on-database");
const makeRegisterUserController = () => {
    const prismaUserRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const registerUserOnDatabase = new register_user_on_database_1.RegisterUserOnDatabase(prismaUserRepository);
    const registerUserController = new register_user_controller_1.RegisterUserController(registerUserOnDatabase);
    return registerUserController;
};
exports.makeRegisterUserController = makeRegisterUserController;
