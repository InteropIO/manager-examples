import { start, type Config } from '@interopio/manager';

import { MyAuthenticator } from './MyAuthenticator';
import { MyGroupsService } from './MyGroupsService';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to get a license.
  licenseKey: process.env.API_LICENSE_KEY as string,
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
  auth_custom: new MyAuthenticator(),
  groups_service: new MyGroupsService(),
};

start(config);
