import { start, type Config } from '@interopio/manager';

import { MyAuthenticator } from './MyAuthenticator';
import { MyGroupsService } from './MyGroupsService';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
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
