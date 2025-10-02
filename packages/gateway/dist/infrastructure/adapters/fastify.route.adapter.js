"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptRoute = void 0;
const adaptRoute = (controller) => {
    return async (req, reply) => {
        const httpRequest = {
            query: req.query,
            body: req.body
        };
        const httpResponse = await controller.handle(httpRequest);
        reply.status(httpResponse.statusCode).send(httpResponse.body);
    };
};
exports.adaptRoute = adaptRoute;
