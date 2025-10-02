import { IPasswordResetRepository } from "../../../../core/repositories/user/IPasswordResetRepository";
import { IUserRepository } from "../../../../core/repositories/user/IUserRepository";
import { InvalidOrExpiredTokenError } from "../../errors/invalidOrExpiredTokenError";
import { isAfter } from "date-fns";
import bcrypt from "bcryptjs"
import { ResetPassword } from "../passwordResetOnService";


jest.mock('bcryptjs');
jest.mock('date-fns', () => ({
  isAfter: jest.fn(),
}));


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


describe('PasswordReset UseCase', () => {
  let passwordReset: ResetPassword

  beforeEach(() => {
    passwordReset = new ResetPassword(
      userRepositoryMock,
      passwordResetRepositoryMock
    )
  })

  it('should return error if token is invalid', async () => {


    passwordResetRepositoryMock.findByToken.mockResolvedValue(null)

    const result = await passwordReset.passwordResetOnService({
      token: 'invalid-token',
      newPassword: 'newPassword123'
    })

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrExpiredTokenError);

  })

  it('should return error if token has expired', async () => {
    const mockResetRequest = {
      userId: 'user123',
      expiresAt: new Date('2025-01-01T00:00:00Z'),
    };

    passwordResetRepositoryMock.findByToken.mockResolvedValue(mockResetRequest);
    (isAfter as jest.Mock).mockReturnValue(true)

    const result = await passwordReset.passwordResetOnService({
      token: 'expired-token',
      newPassword: 'newPassword123'
    })

    expect(isAfter).toHaveBeenCalledWith(new Date(), mockResetRequest.expiresAt)
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrExpiredTokenError);

  })

  it('should reset password successfully if token is valid', async () => {
    const mockResetRequest = {
      userId: 'user123',
      expiresAt: new Date('2025-12-31T23:59:59Z'),
    };

    passwordResetRepositoryMock.findByToken.mockResolvedValue(mockResetRequest);
    (isAfter as jest.Mock).mockReturnValue(false);

    const passwordHash = 'hashedNewPassword';
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);


    const result = await passwordReset.passwordResetOnService({
      token: 'valid-token',
      newPassword: 'newPassword123'
    })

    expect(passwordResetRepositoryMock.findByToken).toHaveBeenCalledWith('valid-token');
    expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 'salt')
    expect(userRepositoryMock.updatePassword).toHaveBeenCalledWith('user123', passwordHash)
    expect(passwordResetRepositoryMock.deleteToken).toHaveBeenCalledWith('valid-token')
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: 'Password changed successfully!' });



  })
})