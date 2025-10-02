import { PrismaClient } from "@prisma/client";
import { IPasswordResetRepository } from "../../core/repositories/user/IPasswordResetRepository";

const prisma = new PrismaClient();

export class PrismaPasswordResetRepository implements IPasswordResetRepository {

  async createToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await prisma.passwordReset.create({
      data: { token, userId, expiresAt },
    });
  }

  async findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null> {
    const resetToken = await prisma.passwordReset.findUnique({ where: { token } });
    return resetToken ? { userId: resetToken.userId, expiresAt: resetToken.expiresAt } : null;
  }

  async deleteToken(token: string): Promise<void> {
    await prisma.passwordReset.delete({ where: { token } });
  }
}
