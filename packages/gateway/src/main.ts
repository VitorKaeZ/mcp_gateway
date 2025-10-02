import { createHttpServer } from "./infrastructure/http/server";


async function main() {
    const httpServer = createHttpServer();
    

    const port = process.env.PORT || 3333
    try {
        await httpServer.listen({
            port: Number(port),
            host: "0.0.0.0"
        })

        console.log(`🚀 Servidor MCP GATEWAY com Fastify rodando na porta ${port}!`);

    } catch (error) {
        httpServer.log.error(error);
        process.exit(1);
    }
}

main()