// src/infrastructure/oauth/google-oauth-service.ts

import { IOAuthService } from "../../core/repositories/user/IOAuthRepository";
import { OAuthUserData } from "../../core/entities/user/user-data";
import axios from "axios";

export class GoogleOAuthService implements IOAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async getAccessToken(authCode: string): Promise<string> {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: authCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    return response.data.access_token;
  }

  async getUserInfo(token: string): Promise<OAuthUserData> {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { email, id, given_name, family_name, picture  } = response.data;

    return {
      id,
      email,
      firstname: given_name,
      lastname: family_name,
      picture,
      token,
    };
  }
}
