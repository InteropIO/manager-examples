import path from 'node:path';

import { EnvironmentVariables } from './env/environment-variables.js';
import { formatEnvFile } from './env/format-env-file.js';
import { fileExists } from './file-exists.js';
import { useFileContents, useProcessedFile } from './file-mod.js';

// Injects the real license key into a server example, runs `fn`, then restores
// the example to its original state (even if `fn` throws or the process is
// signalled). There are two example shapes and they carry the license
// differently, so injection has two branches:
//
//   - Env-var-configured examples (have a `.env`, e.g.
//     `environment-variable-configuration`) read the license from
//     `API_LICENSE_KEY` at runtime. We inject by writing a temporary
//     `.env.local` that overrides it.
//   - Hardcoded-config examples bake `<YOUR_LICENSE_KEY>` into `src/index.ts`,
//     which `tsc` copies into `dist/index.js`. We inject by replacing that
//     placeholder in the built `dist/index.js`.
//
// `packageDir` must be the absolute path to the server package so the temporary
// file lands in the right place regardless of the current working directory —
// this is what makes the helper safe to call for several examples in parallel.
export async function withInjectedLicense(packageDir, fn) {
  const licenseKey = EnvironmentVariables.API_LICENSE_KEY;

  const envPath = path.join(packageDir, '.env');

  if (await fileExists(envPath)) {
    return useFileContents(
      path.join(packageDir, '.env.local'),
      formatEnvFile({ API_LICENSE_KEY: licenseKey }),
      fn
    );
  }

  return useProcessedFile(
    path.join(packageDir, 'dist', 'index.js'),
    (contents) => contents.replaceAll('<YOUR_LICENSE_KEY>', licenseKey),
    fn
  );
}
