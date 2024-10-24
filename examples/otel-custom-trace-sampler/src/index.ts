import { start, Config } from '@interopio/manager';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  auth_method: 'none',
  auth_exclusive_users: ['example_user'],
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
    },
    traces: {
      enabled: true,
      url: 'http://localhost:4318/v1/traces',
      customSampler: new TraceIdRatioBasedSampler(0.5),
    },
  },
};

start(config);
