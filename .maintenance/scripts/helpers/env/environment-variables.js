import { EnvParser } from './env-parser.js';

const parser = new EnvParser(process.env);

export const EnvironmentVariables = {
  get NPM_SCOPED_PACKAGES_REGISTRY_URL() {
    return parser.parseOptionalString('NPM_SCOPED_PACKAGES_REGISTRY_URL');
  },

  get NPM_SCOPED_PACKAGES_REGISTRY_TOKEN() {
    return parser.parseRequiredString(
      'NPM_SCOPED_PACKAGES_REGISTRY_TOKEN',
      'The "NPM_SCOPED_PACKAGES_REGISTRY_TOKEN" environment variable is required when "NPM_SCOPED_PACKAGES_REGISTRY_URL" is set.'
    );
  },

  get NPM_SCOPED_PACKAGES_FORCE_LATEST_VERSIONS() {
    return (
      parser.parseOptionalBoolean(
        'NPM_SCOPED_PACKAGES_FORCE_LATEST_VERSIONS'
      ) ?? false
    );
  },

  get CI_DEBUG() {
    return parser.parseOptionalString('CI_DEBUG');
  },

  get API_LICENSE_KEY() {
    return parser.parseRequiredString('API_LICENSE_KEY');
  },

  get IO_MANAGER_DIR() {
    return parser.parseRequiredString(
      'IO_MANAGER_DIR',
      'The "IO_MANAGER_DIR" environment variable is required to start the dev databases. Set it to the absolute path of your io.Manager monorepo checkout (the folder containing the "start:db-dev" npm script).'
    );
  },
};
