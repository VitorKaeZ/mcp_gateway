import { OAuthUserData } from "../../entities/user/user-data";

export interface IOAuthService {
  getAccessToken(authCode: string): Promise<string>;
  getUserInfo(token: string): Promise<OAuthUserData>;
}
