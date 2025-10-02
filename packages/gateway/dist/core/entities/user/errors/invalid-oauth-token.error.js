"use strict";
// src/domain/entities/user/errors/invalid-oauth-token.error.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOAuthTokenError = void 0;
class InvalidOAuthTokenError extends Error {
    constructor() {
        super('Invalid OAuth token.');
        this.name = 'InvalidOAuthTokenError';
    }
}
exports.InvalidOAuthTokenError = InvalidOAuthTokenError;
