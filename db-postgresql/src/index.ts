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
    type: 'postgresql',
    // TODO: Replace this with your own PostgreSQL connection string.
    connection: 'postgresql://db_user:Password123$@localhost:5432',
    dbName: 'io_manager',
    schemaName: 'public',
  },
  token: {
    // TODO: Replace this with your secret.
    secret: '<YOUR_SECRET>',
  },
};

start(config);
