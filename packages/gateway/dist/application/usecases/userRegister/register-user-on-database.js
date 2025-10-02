"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserOnDatabase = void 0;
const user_1 = require("../../../core/entities/user/user");
const either_1 = require("../../../shared/either");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_exists_error_1 = require("../errors/email-exists-error");
class RegisterUserOnDatabase {
    constructor(userRepo) {
        this.userRepository = userRepo;
    }
    async registerUserOnDatabase(userData) {
        const useOrError = user_1.User.create(userData);
        if (useOrError.isLeft()) {
            return (0, either_1.left)(useOrError.value);
        }
        console.log("antes do user");
        const user = useOrError.value;
        console.log(user);
        const exists = await this.userRepository.exists(user.email.value);
        console.log("depois do exists", exists);
        if (exists) {
            return (0, either_1.left)(new email_exists_error_1.EmailAlreadyExistsError());
        }
        console.log(user);
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(user.password.value, salt);
        await this.userRepository.add({ firstname: user.firstname.value, lastname: user.lastname.value, email: user.email.value, password: passwordHash });
        const response = {
            email: user.email.value,
            firstname: user.firstname.value,
            lastname: user.lastname.value
        };
        return (0, either_1.right)(response);
    }
}
exports.RegisterUserOnDatabase = RegisterUserOnDatabase;
