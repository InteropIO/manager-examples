import { start, type Config } from '@interopio/manager';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const config: Config = {
  name: 'example',
  port: 4356,
  base: 'api',
  // TODO: Contact us at sales@interop.io to get a valid license.
  licenseKey: process.env.API_LICENSE_KEY as string,
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
    },
    logs: {
      enabled: true,
      customProcessor: new SimpleLogRecordProcessor(
        new OTLPLogExporter({
          url: 'http://localhost:4318/v1/logs',
        })
      ),
    },
  },
};

start(config);
