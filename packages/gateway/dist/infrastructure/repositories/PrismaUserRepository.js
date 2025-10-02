"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaUserRepository {
    async findAllUsers() {
        // Busca todos os usuários no banco de dados
        return await prisma.user.findMany();
    }
    async findUserByEmail(email) {
        // Busca um usuário pelo e-mail
        const result = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                password: true,
            },
        });
        return result;
    }
    async add(user) {
        // Verifica se o usuário já existe pelo e-mail
        const exists = await this.exists(user.email);
        if (!exists) {
            // Adiciona o usuário se ele não existir
            const userResponse = await prisma.user.create({
                data: user,
            });
        }
    }
    async exists(email) {
        // Verifica se o usuário existe pelo e-mail
        const user = await this.findUserByEmail(email);
        console.log("exists no repo", user);
        return user !== null;
    }
    async updatePassword(userId, newPassword) {
        await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword }, // Deve ser hash da senha
        });
    }
    async findUserByGoogleId(googleId) {
        const user = await prisma.user.findUnique({
            where: { googleId },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            googleId: user.googleId,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
