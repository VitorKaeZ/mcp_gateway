import { InvalidOAuthTokenError } from "../../../../core/entities/user/errors/invalid-oauth-token.error";
import { IOAuthService } from "../../../../core/repositories/user/IOAuthRepository";
import { IUserRepository } from "../../../../core/repositories/user/IUserRepository";
import { AuthenticateUserWithGoogle } from "../login-user-with-oauth-on-service";

const makeOAuthServiceMock = (): jest.Mocked<IOAuthService> => ({
  getAccessToken: jest.fn(),
  getUserInfo: jest.fn(),
});

const makeUserRepositoryMock = (): jest.Mocked<IUserRepository> => ({
  findUserByGoogleId: jest.fn(),
  add: jest.fn(),
  exists: jest.fn(),
  findAllUsers: jest.fn(),
  findUserByEmail: jest.fn(),
  updatePassword: jest.fn(),
});

const mockUserData = {
  id: "google-user-id",
  email: "test@example.com",
  firstname: "Test",
  lastname: "User",
};

describe('LoginUserOAuthOnService UseCase', () => {
   it('must log in successfully with valid email and password', async () => {
    const oAuthServiceMock = makeOAuthServiceMock();
    const userRepositoryMock = makeUserRepositoryMock();

    oAuthServiceMock.getAccessToken.mockResolvedValue("valid-token");
    oAuthServiceMock.getUserInfo.mockResolvedValue(mockUserData);
    userRepositoryMock.findUserByGoogleId.mockResolvedValue(mockUserData);

    const useCase = new AuthenticateUserWithGoogle(oAuthServiceMock, userRepositoryMock);

    const result = await useCase.execute("valid-token");

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockUserData);
    expect(userRepositoryMock.add).not.toHaveBeenCalled();
   })

   it("should return new user if user doesn't exist", async () => {
    const oAuthServiceMock = makeOAuthServiceMock();
    const userRepositoryMock = makeUserRepositoryMock();

    oAuthServiceMock.getAccessToken.mockResolvedValue("valid-token");
    oAuthServiceMock.getUserInfo.mockResolvedValue(mockUserData);
    userRepositoryMock.findUserByGoogleId.mockResolvedValue(null);

    const useCase = new AuthenticateUserWithGoogle(oAuthServiceMock, userRepositoryMock);

    const result = await useCase.execute("valid-token");

    expect(result.isRight()).toBe(true);
    expect(userRepositoryMock.add).toHaveBeenCalledWith({
      googleId: mockUserData.id,
      email: mockUserData.email,
      firstname: mockUserData.firstname,
      lastname: mockUserData.lastname,
    });
   })

    it("should return error if token is invalid", async () => {
      const oAuthServiceMock = makeOAuthServiceMock();
      const userRepositoryMock = makeUserRepositoryMock();  

      oAuthServiceMock.getAccessToken.mockResolvedValue("invalid-token");

      const useCase = new AuthenticateUserWithGoogle(oAuthServiceMock, userRepositoryMock);

      const result = await useCase.execute("invalid-token");

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InvalidOAuthTokenError);
    
    })
})