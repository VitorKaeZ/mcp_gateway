import { addHours } from "date-fns"
import { UserData } from "../../../../core/entities/user/user-data"
import { IPasswordResetRepository } from "../../../../core/repositories/user/IPasswordResetRepository"
import { IUserRepository } from "../../../../core/repositories/user/IUserRepository"
import { IEmailService } from "../../../services/IEmailService"
import { InvalidOrExpiredTokenError } from "../../errors/invalidOrExpiredTokenError"
import { RequestPasswordReset } from "../requestPasswordResetOnService"
import crypto from "crypto";

jest.mock('crypto');

const userRepositoryMock: jest.Mocked<IUserRepository> = {
  exists: jest.fn(),
  add: jest.fn(),
  findAllUsers: jest.fn(),
  findUserByEmail: jest.fn(),
  updatePassword: jest.fn(),
} as any;

const passwordResetRepositoryMock: jest.Mocked<IPasswordResetRepository> = {
  createToken: jest.fn(),
  findByToken: jest.fn(),
  deleteToken: jest.fn(),
} as any;

const emailServiceMock: jest.Mocked<IEmailService> = {
  sendEmail: jest.fn(),
};



describe('RequestPasswordReset UseCase', () => {

  let reqPasswordReset: RequestPasswordReset

  beforeEach(() => {

    reqPasswordReset = new RequestPasswordReset(
      userRepositoryMock,
      passwordResetRepositoryMock,
      emailServiceMock
    )
  })

  it('should return error if email is not found', async () => {

    userRepositoryMock.findUserByEmail.mockResolvedValue(null)

    const result = await reqPasswordReset.reqPasswordResetOnService({ email: "invalid@example.com " })


    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrExpiredTokenError)
  })

  it('must generate a password reset token and send an email with the link', async () => {
    const validUser: UserData = {
      id: "123456",
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password', // A senha no banco de dados estaria criptografada
    };

    userRepositoryMock.findUserByEmail.mockResolvedValue(validUser)

    const token = "random-token";
    (crypto.randomBytes as jest.Mock).mockReturnValue(token); // Correção aqui!

    const expiresAt = addHours(new Date(), 0.10)
    passwordResetRepositoryMock.createToken.mockResolvedValue()

    emailServiceMock.sendEmail.mockResolvedValue()

    const result = await reqPasswordReset.reqPasswordResetOnService({ email: "john.doe@example.com" })


    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ email: "john.doe@example.com" })

    expect(passwordResetRepositoryMock.createToken).toHaveBeenCalledWith(validUser.id, token, expiresAt)


    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    expect(emailServiceMock.sendEmail).toHaveBeenCalledWith(
      "john.doe@example.com",
      "Password Reset",
      `Click Here: ${resetLink}`
    )
  })

})