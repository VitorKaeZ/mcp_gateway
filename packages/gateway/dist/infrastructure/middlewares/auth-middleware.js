"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateJwt;
const jsonwebtoken_1 = require("jsonwebtoken");
function authenticateJwt() {
    return async (request, reply) => {
        const authorization = request.headers.authorization;
        if (!authorization) {
            return reply.code(401).send({ error: "Token is missing!" });
        }
        // const [,token] = authorization.split(' ');
        // console.log(token)
        try {
            const secret = process.env.JWT_TOKEN;
            if (!secret) {
                throw new Error('JWT secret is not defined');
            }
            const decodedToken = (0, jsonwebtoken_1.verify)(authorization, secret);
            // @ts-ignore
            request.headers['user-id'] = decodedToken.userId;
            // request.headers['user-role'] = decodedToken.roles;
        }
        catch (error) {
            return reply.code(401).send({ error: "Invalid token!" });
        }
    };
}
