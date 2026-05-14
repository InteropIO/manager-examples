import { start, type Config } from '@interopio/manager';

const licenseKey = process.env.API_LICENSE_KEY;

if (!licenseKey) {
  throw new Error(
    'API_LICENSE_KEY environment variable is required to start the auth-none example server.'
  );
}

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  licenseKey: licenseKey,
  store: {
    type: 'mongo',
    connection:
      // TODO: Replace this with your own MongoDB connection string.
      'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
  },
  token: {
    // TODO: Replace this with your secret.
    secret: '<YOUR_SECRET>',
  },
  auth_method: 'none',

  // A list of usernames which will have admin privileges
  auth_exclusive_users: ['admin'],
};

start(config);
