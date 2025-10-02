import { IPasswordResetRepository } from "../../../core/repositories/user/IPasswordResetRepository";
import { IUserRepository } from "../../../core/repositories/user/IUserRepository";
import { Either, left, right } from "../../../shared/either";
import { InvalidOrExpiredTokenError } from "../errors/invalidOrExpiredTokenError";
import { PasswordReset, PasswordResetInterface } from "./passwordReset";
import { isAfter } from "date-fns";
import bcrypt from "bcryptjs"

export class ResetPassword implements PasswordReset {
    private userRepository: IUserRepository;
    private passwordResetRepository: IPasswordResetRepository;

  constructor(userRepo: IUserRepository, passwordRepo: IPasswordResetRepository) {
    this.userRepository = userRepo;
    this.passwordResetRepository = passwordRepo;
  }
   

    async passwordResetOnService ({token, newPassword}:PasswordResetInterface): Promise<Either<InvalidOrExpiredTokenError, {message: string}>>{
        const resetRequest = await this.passwordResetRepository.findByToken(token)

        if (!resetRequest || isAfter(new Date(), resetRequest.expiresAt)) {
            return left(new InvalidOrExpiredTokenError())
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(newPassword, salt)

        await this.userRepository.updatePassword(resetRequest.userId, passwordHash)
        await this.passwordResetRepository.deleteToken(token)


        return right({ message: 'Password changed successfully!' })
    }
}