import { start } from '@interopio/manager';

// Omitting the configuration object here will force io.Manager
// to start with configuration using environment variables.
// An additional environment variable file will be read from "${CWD}/.env"
start();
