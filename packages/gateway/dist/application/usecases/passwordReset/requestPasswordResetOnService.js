"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordReset = void 0;
const either_1 = require("../../../shared/either");
const invalidOrExpiredTokenError_1 = require("../errors/invalidOrExpiredTokenError");
const date_fns_1 = require("date-fns");
const crypto_1 = __importDefault(require("crypto"));
class RequestPasswordReset {
    constructor(userRepo, passwordRepo, emailService) {
        this.userRepository = userRepo;
        this.passwordResetRepository = passwordRepo;
        this.emailService = emailService;
    }
    async reqPasswordResetOnService({ email }) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user || !user.id) {
            return (0, either_1.left)(new invalidOrExpiredTokenError_1.InvalidOrExpiredTokenError());
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = (0, date_fns_1.addHours)(new Date(), 0.10);
        await this.passwordResetRepository.createToken(user.id, token, expiresAt);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.emailService.sendEmail(user.email, "Password Reset", `Click Here: ${resetLink}`);
        return (0, either_1.right)({ email });
    }
}
exports.RequestPasswordReset = RequestPasswordReset;
