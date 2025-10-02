"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const either_1 = require("../../../shared/either");
const email_1 = require("./email");
const name_1 = require("./name");
const password_1 = require("./password");
class User {
    constructor(firstname, lastname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        Object.freeze(this);
    }
    static create(userData) {
        const firstnameOrError = name_1.Name.create(userData.firstname);
        const lastnameOrError = name_1.Name.create(userData.lastname);
        const emailOrError = email_1.Email.create(userData.email);
        const passwordOrError = password_1.Password.create(userData.password || '');
        if (firstnameOrError.isLeft()) {
            return (0, either_1.left)(firstnameOrError.value);
        }
        if (lastnameOrError.isLeft()) {
            return (0, either_1.left)(lastnameOrError.value);
        }
        if (emailOrError.isLeft()) {
            return (0, either_1.left)(emailOrError.value);
        }
        if (passwordOrError.isLeft()) {
            return (0, either_1.left)(passwordOrError.value);
        }
        const firstname = firstnameOrError.value;
        const lastname = lastnameOrError.value;
        const email = emailOrError.value;
        const password = passwordOrError.value;
        return (0, either_1.right)(new User(firstname, lastname, email, password));
    }
}
exports.User = User;
