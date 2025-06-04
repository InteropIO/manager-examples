import * as Sentry from '@sentry/node';
import * as SentryOtel from '@sentry/opentelemetry';
import { start, type Config } from '@interopio/manager';

const sentryClient = Sentry.init({
  // TODO: Replace this with your own Sentry DSN.
  dsn: 'https://46544e1c0caf87b077ae9e5bd40aee0f@o4509439768461312.ingest.de.sentry.io/4509439770099792',
  skipOpenTelemetrySetup: true,
  tracesSampleRate: 1.0,
})!;

void (async () => {
  const config: Config = {
    name: 'example',
    port: 4356,
    base: 'api',
    // TODO: Contact us at sales@interop.io to get a license.
    licenseKey: process.env.API_LICENSE_KEY as string,
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
        serviceNamespace: 'servers',
        serviceInstanceID: 'instance1',
        deploymentEnvironment: 'development',
      },
      traces: {
        enabled: true,
        customSampler: new SentryOtel.SentrySampler(sentryClient),
        customProcessor: new SentryOtel.SentrySpanProcessor() as any,
        customPropagator: new SentryOtel.SentryPropagator(),
        customContextManager: new Sentry.SentryContextManager(),
      },
    },
    monitoring: {
      type: 'sentry',
      sentryClient,
    },
  };

  await start(config);

  Sentry.validateOpenTelemetrySetup();
})().catch((error) => {
  console.error('Error starting Interop.io Manager:', error);
  process.exit(1);
});
