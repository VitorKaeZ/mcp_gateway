"use strict";
// src/infrastructure/oauth/google-oauth-service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
class GoogleOAuthService {
    constructor(clientId, clientSecret, redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }
    async getAccessToken(authCode) {
        const response = await axios_1.default.post('https://oauth2.googleapis.com/token', {
            code: authCode,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
        });
        return response.data.access_token;
    }
    async getUserInfo(token) {
        const response = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { email, id, given_name, family_name, picture } = response.data;
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
exports.GoogleOAuthService = GoogleOAuthService;
