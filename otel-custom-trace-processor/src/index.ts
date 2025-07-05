import { start, type Config } from '@interopio/manager';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

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
      customProcessor: new SimpleSpanProcessor(
        new OTLPTraceExporter({
          url: 'http://localhost:4318/v1/traces',
        })
      ),
    },
  },
};

start(config);
