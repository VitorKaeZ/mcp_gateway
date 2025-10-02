"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePasswordResetController = void 0;
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const PasswordResetController_1 = require("../../interfaces/controllers/PasswordResetController");
const PrismaPasswordResetRepository_1 = require("../../infrastructure/repositories/PrismaPasswordResetRepository");
const passwordResetOnService_1 = require("../../application/usecases/passwordReset/passwordResetOnService");
const makePasswordResetController = () => {
    const prismaUserRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const prismaPasswordResetRepository = new PrismaPasswordResetRepository_1.PrismaPasswordResetRepository();
    const passwordResetrOnDatabase = new passwordResetOnService_1.ResetPassword(prismaUserRepository, prismaPasswordResetRepository);
    const passwordResetController = new PasswordResetController_1.PasswordResetController(passwordResetrOnDatabase);
    return passwordResetController;
};
exports.makePasswordResetController = makePasswordResetController;
