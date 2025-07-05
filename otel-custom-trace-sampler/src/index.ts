import { start, type Config } from '@interopio/manager';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to get a license.
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
