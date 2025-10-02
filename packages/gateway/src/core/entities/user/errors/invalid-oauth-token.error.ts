// src/domain/entities/user/errors/invalid-oauth-token.error.ts

export class InvalidOAuthTokenError extends Error {
    constructor() {
      super('Invalid OAuth token.');
      this.name = 'InvalidOAuthTokenError';
    }
  }
  