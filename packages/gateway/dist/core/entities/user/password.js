"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const either_1 = require("../../../shared/either");
const invalid_password_1 = require("./errors/invalid.password");
class Password {
    constructor(password) {
        this.password = password;
        Object.freeze(this);
    }
    static create(password) {
        if (!Password.validate(password)) {
            return (0, either_1.left)(new invalid_password_1.InvalidPasswordError(password));
        }
        return (0, either_1.right)(new Password(password));
    }
    get value() {
        return this.password;
    }
    static validate(password) {
        if (!password) {
            return false;
        }
        if (password.length < 8) {
            return false;
        }
        return true;
    }
}
exports.Password = Password;
