"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequestPasswordResetController = void 0;
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const PrismaPasswordResetRepository_1 = require("../../infrastructure/repositories/PrismaPasswordResetRepository");
const RequestPasswordResetController_1 = require("../../interfaces/controllers/RequestPasswordResetController");
const requestPasswordResetOnService_1 = require("../../application/usecases/passwordReset/requestPasswordResetOnService");
const NodeMailerService_1 = require("../../infrastructure/email/NodeMailerService");
const makeRequestPasswordResetController = () => {
    const prismaUserRepository = new PrismaUserRepository_1.PrismaUserRepository();
    const prismaPasswordResetRepository = new PrismaPasswordResetRepository_1.PrismaPasswordResetRepository();
    const emailService = new NodeMailerService_1.NodeMailerService();
    const passwordResetrOnDatabase = new requestPasswordResetOnService_1.RequestPasswordReset(prismaUserRepository, prismaPasswordResetRepository, emailService);
    const passwordResetController = new RequestPasswordResetController_1.RequestPasswordResetController(passwordResetrOnDatabase);
    return passwordResetController;
};
exports.makeRequestPasswordResetController = makeRequestPasswordResetController;
