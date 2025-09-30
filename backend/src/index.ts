import fastify from "fastify";

const server = fastify({
    logger: true // Enable logger for better development experience
});

server.get('/', async (_, __) => {
    return { hello: 'world' };
});

const start = async () => {
    try {
        await server.listen({ port: 4000, host: "0.0.0.0" });
        console.log('Server listening on http://localhost:4000');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();