import { start, type Config } from '@interopio/manager';

import { MyAuthenticator } from './MyAuthenticator';
import { MyGroupsService } from './MyGroupsService';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to get a valid license.
  licenseKey: process.env.API_LICENSE_KEY as string,
  store: {
    type: 'mongo',
    connection:
      'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
  },
  token: {
    secret: '<YOUR_SECRET>',
  },
  auth_method: 'custom',
  auth_custom: new MyAuthenticator(),
  groups_service: new MyGroupsService(),
};

start(config);
