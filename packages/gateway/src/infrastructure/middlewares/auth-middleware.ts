import { FastifyRequest, FastifyReply, preHandlerAsyncHookHandler } from 'fastify';
import { verify } from 'jsonwebtoken';

export default function authenticateJwt(): preHandlerAsyncHookHandler {
    return async (request: FastifyRequest, reply: FastifyReply) => {
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
            
            const decodedToken = verify(authorization, secret);

            // @ts-ignore
            request.headers['user-id'] = decodedToken.userId;
            // request.headers['user-role'] = decodedToken.roles;
        } catch (error) {
            return reply.code(401).send({ error: "Invalid token!" });
        }
    };
}
