import { start, type Config } from '@interopio/manager';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to acquire a license key.
  licenseKey: '<YOUR_LICENSE_KEY>',
  auth_method: 'none',
  auth_exclusive_users: ['admin'],
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
};

await start(config);
