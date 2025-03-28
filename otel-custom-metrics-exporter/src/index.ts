import { start, type Config } from '@interopio/manager';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

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
    },
    metrics: {
      enabled: true,
      customExporter: new OTLPMetricExporter({
        url: 'http://localhost:4318/v1/metrics',
      }),
    },
  },
};

start(config);
