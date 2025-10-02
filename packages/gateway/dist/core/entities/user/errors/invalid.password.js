"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPasswordError = void 0;
class InvalidPasswordError extends Error {
    constructor(password) {
        super(`The password is invalid.`);
        this.name = 'InvalidNameError';
    }
}
exports.InvalidPasswordError = InvalidPasswordError;
