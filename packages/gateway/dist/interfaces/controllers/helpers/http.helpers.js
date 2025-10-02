"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.serverError = exports.ok = exports.badRequest = void 0;
const server_error_1 = require("../errors/server.error");
const badRequest = (error) => ({
    statusCode: 400,
    body: error.message
});
exports.badRequest = badRequest;
const ok = (data) => ({
    statusCode: 200,
    body: data
});
exports.ok = ok;
const serverError = (reason) => ({
    statusCode: 500,
    body: new server_error_1.ServerError(reason)
});
exports.serverError = serverError;
const unauthorized = (error) => ({
    statusCode: 401,
    body: {
        error: error.message
    }
});
exports.unauthorized = unauthorized;
