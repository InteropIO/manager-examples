import { start, type Config } from '@interopio/manager';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to get a license.
  licenseKey: process.env.API_LICENSE_KEY as string,
  auth_method: 'none',
  auth_exclusive_users: ['admin'],
  store: {
    type: 'mssql',
    server: 'localhost',
    userName: 'SA',
    port: 1433,
    password: 'Password123$',
    dbName: 'io_manager',
  },
  token: {
    secret: '<YOUR_SECRET>',
  },
};

start(config);
