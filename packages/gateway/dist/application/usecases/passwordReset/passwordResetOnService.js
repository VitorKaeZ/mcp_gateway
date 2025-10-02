"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const either_1 = require("../../../shared/either");
const invalidOrExpiredTokenError_1 = require("../errors/invalidOrExpiredTokenError");
const date_fns_1 = require("date-fns");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPassword {
    constructor(userRepo, passwordRepo) {
        this.userRepository = userRepo;
        this.passwordResetRepository = passwordRepo;
    }
    async passwordResetOnService({ token, newPassword }) {
        const resetRequest = await this.passwordResetRepository.findByToken(token);
        if (!resetRequest || (0, date_fns_1.isAfter)(new Date(), resetRequest.expiresAt)) {
            return (0, either_1.left)(new invalidOrExpiredTokenError_1.InvalidOrExpiredTokenError());
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        await this.userRepository.updatePassword(resetRequest.userId, passwordHash);
        await this.passwordResetRepository.deleteToken(token);
        return (0, either_1.right)({ message: 'Password changed successfully!' });
    }
}
exports.ResetPassword = ResetPassword;
