"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const either_1 = require("../../../shared/either");
const invalid_email_1 = require("./errors/invalid.email");
class Email {
    constructor(email) {
        this.email = email;
        Object.freeze(this);
    }
    static create(email) {
        if (!Email.validate(email)) {
            return (0, either_1.left)(new invalid_email_1.InvalidEmailError(email));
        }
        return (0, either_1.right)(new Email(email));
    }
    get value() {
        return this.email;
    }
    static validate(email) {
        let tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!email) {
            return false;
        }
        if (email.length > 256) {
            return false;
        }
        if (!tester.test(email)) {
            return false;
        }
        let [account, address] = email.split('@');
        if (account.length > 64) {
            return false;
        }
        let domainParts = address.split('.');
        if (domainParts.some((part) => {
            return part.length > 63;
        })) {
            return false;
        }
        return true;
    }
}
exports.Email = Email;
