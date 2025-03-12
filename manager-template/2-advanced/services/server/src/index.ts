import { start, Config } from "@interopio/manager";

const config: Config = {
  name: process.env.API_NAME,
  port: Number(process.env.API_PORT),
  base: process.env.API_BASE || "",
  store: {
    type: "mongo",
    connection: process.env.API_STORE_MONGO,
  },
  token: {
    secret: process.env.API_TOKEN_SECRET as string,
  },
  auth_method: "none",
  auth_exclusive_users: ["admin"],
};

start(config);
