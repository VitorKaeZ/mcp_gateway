// src/application/usecases/oauth/authenticate-user-with-google.ts

import { IOAuthService } from "../../../core/repositories/user/IOAuthRepository";
import { OAuthUserData } from "../../../core/entities/user/user-data";
import { Either, left, right } from "../../../shared/either";
import { InvalidOAuthTokenError } from "../../../core/entities/user/errors/invalid-oauth-token.error";
import { LoginUserWithOAuth } from "./oauth-user";
import { IUserRepository } from "../../../core/repositories/user/IUserRepository";

export class AuthenticateUserWithGoogle implements LoginUserWithOAuth {
  private oAuthService: IOAuthService;
  private userRepository: IUserRepository;

  constructor(oAuthService: IOAuthService, userRepository: IUserRepository,) {
    this.oAuthService = oAuthService;
    this.userRepository = userRepository;
  }

  async execute(authCode: string): Promise<Either<InvalidOAuthTokenError, OAuthUserData>> {
    try {
      const token = await this.oAuthService.getAccessToken(authCode);

      if (!token) {
        return left(new InvalidOAuthTokenError());
      }

      const userInfo = await this.oAuthService.getUserInfo(token);


      let user = await this.userRepository.findUserByGoogleId(userInfo.id);

      if (!user) {
        await this.userRepository.add({
          googleId: userInfo.id,
          email: userInfo.email || "",
          firstname: userInfo.firstname || "",
          lastname: userInfo.lastname || "",
        })
      }

      return right(userInfo);
    } catch (error) {
      console.log(error)

      return left(new InvalidOAuthTokenError());
    }
  }
}
