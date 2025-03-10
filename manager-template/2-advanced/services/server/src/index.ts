import { start, Config } from "@interopio/manager";

const startServer = async () => {
    const auth_exclusive_users = ["<CHANGE_ME>"];

    const config: Config = {
        name: process.env.SERVER_NAME || "test-server",
        port: Number(process.env.SERVER_PORT) || 4356,
        base: process.env.SERVER_BASE_HREF,
        store: {
            type: "mongo",
            connection: process.env.SERVER_DB_CONNECTION_STRING || `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/g42-home?authSource=admin`
        },
        token: {
            secret: process.env.SERVER_TOKEN_SECRET as string
        },
        auth_method: "none",
        auth_exclusive_users
    };

    const server = await start(config);   
}

startServer();
