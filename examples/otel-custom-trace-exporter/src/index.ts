import { start, Config } from '@interopio/manager';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

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
      customExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
      }),
    },
  },
};

start(config);
