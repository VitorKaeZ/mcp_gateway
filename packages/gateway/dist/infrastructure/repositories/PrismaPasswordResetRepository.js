"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPasswordResetRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaPasswordResetRepository {
    async createToken(userId, token, expiresAt) {
        await prisma.passwordReset.create({
            data: { token, userId, expiresAt },
        });
    }
    async findByToken(token) {
        const resetToken = await prisma.passwordReset.findUnique({ where: { token } });
        return resetToken ? { userId: resetToken.userId, expiresAt: resetToken.expiresAt } : null;
    }
    async deleteToken(token) {
        await prisma.passwordReset.delete({ where: { token } });
    }
}
exports.PrismaPasswordResetRepository = PrismaPasswordResetRepository;
