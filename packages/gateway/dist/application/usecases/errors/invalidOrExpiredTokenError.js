"use strict";
// usecases/errors/invalid-credentials-error.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOrExpiredTokenError = void 0;
class InvalidOrExpiredTokenError extends Error {
    constructor() {
        super("Invalid or expired token");
        this.name = "InvalidOrExpiredTokenError";
    }
}
exports.InvalidOrExpiredTokenError = InvalidOrExpiredTokenError;
