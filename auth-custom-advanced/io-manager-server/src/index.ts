import { start, Config } from '@interopio/manager';

import { CustomOktaAuthenticator } from './CustomOktaAuthenticator.js';

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
  auth_method: 'custom',
  auth_custom: new CustomOktaAuthenticator(),
};

start(config);
