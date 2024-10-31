import { start, type Config } from '@interopio/manager';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  store: {
    type: 'mongo',

    // TODO: Replace this with your own MongoDB connection string.
    connection:
      'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
  },
  token: {
    // TODO: Replace this with your secret.
    secret: '<YOUR_SECRET>',
  },
  auth_method: 'auth0',
  auth_auth0: {
    // TODO: Replace this with your domain. (you must place https:// at the start of the string)
    issuerBaseURL: 'https://dev-vccmw066d2ot7rcj.eu.auth0.com',
    audience: 'http://localhost:4356/api',
  },
};

start(config);
