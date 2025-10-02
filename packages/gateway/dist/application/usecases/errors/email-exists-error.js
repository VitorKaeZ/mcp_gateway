"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = void 0;
class EmailAlreadyExistsError extends Error {
    constructor() {
        super('Mail already exists.');
        this.name = 'EmailAlreadyExistsError';
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
