import { IPasswordResetRepository } from "../../../core/repositories/user/IPasswordResetRepository";
import { IUserRepository } from "../../../core/repositories/user/IUserRepository";
import { Either, left, right } from "../../../shared/either";
import { InvalidOrExpiredTokenError } from "../errors/invalidOrExpiredTokenError";
import { PasswordReset, PasswordResetInterface } from "./passwordReset";
import { addHours, isAfter } from "date-fns";
import bcrypt from "bcryptjs"
import { IEmailService } from "../../services/IEmailService";
import { RequestPasswordResetInterface } from "./requestPasswordReset";
import crypto from "crypto";

export class RequestPasswordReset implements RequestPasswordReset {
  private userRepository: IUserRepository;
  private passwordResetRepository: IPasswordResetRepository;
  private emailService: IEmailService;

  constructor(userRepo: IUserRepository, passwordRepo: IPasswordResetRepository, emailService: IEmailService) {
    this.userRepository = userRepo;
    this.passwordResetRepository = passwordRepo;
    this.emailService = emailService;
  }


  async reqPasswordResetOnService({ email }: RequestPasswordResetInterface): Promise<Either<InvalidOrExpiredTokenError, RequestPasswordResetInterface>> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user || !user.id) {
      return left(new InvalidOrExpiredTokenError())

    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = addHours(new Date(), 0.10)

    await this.passwordResetRepository.createToken(user.id, token, expiresAt)

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await this.emailService.sendEmail(user.email, "Password Reset", `Click Here: ${resetLink}`)

    return right({ email })
  }
}