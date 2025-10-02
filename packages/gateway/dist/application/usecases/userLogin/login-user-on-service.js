"use strict";
// usecases/login/login-user-on-database.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserOnService = void 0;
const either_1 = require("../../../shared/either");
const invalid_credentials_error_1 = require("../errors/invalid-credentials-error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUserOnService {
    constructor(userRepo) {
        this.userRepository = userRepo;
    }
    async loginUserOnService(userData) {
        const user = await this.userRepository.findUserByEmail(userData.email);
        if (!user || !user.password) {
            return (0, either_1.left)(new invalid_credentials_error_1.InvalidCredentialsError());
        }
        const passwordMatch = await bcryptjs_1.default.compare(userData.password, user.password);
        if (!passwordMatch) {
            return (0, either_1.left)(new invalid_credentials_error_1.InvalidCredentialsError());
        }
        const jwtToken = "" + process.env.JWT_TOKEN;
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtToken, {
            expiresIn: "1h",
        });
        const response = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.firstname,
            token
        };
        return (0, either_1.right)(response);
    }
}
exports.LoginUserOnService = LoginUserOnService;
