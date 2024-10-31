import { start, type Config } from '@interopio/manager';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  auth_method: 'none',
  auth_exclusive_users: ['admin'],
  store: {
    type: 'mongo',
    connection:
      'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
  },
  token: {
    secret: '<YOUR_SECRET>',
  },
  otel: {
    enabled: true,
    resource: {
      serviceName: 'io-manager',
      serviceNamespace: 'servers',
      serviceInstanceID: 'instance1',
      deploymentEnvironment: 'development',
    },
    logs: {
      enabled: true,
      url: 'http://localhost:4318/v1/logs',
    },
    traces: {
      enabled: true,
      url: 'http://localhost:4318/v1/traces',
    },
    metrics: {
      enabled: true,
      url: 'http://localhost:4318/v1/metrics',
    },
  },
};

start(config);
