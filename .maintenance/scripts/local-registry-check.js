import process from 'node:process';

import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { localRegistryURl } from './helpers/variables.js';
import { parseOptions } from './helpers/parse-options.js';

parseOptions();

await visitNpmPackages(async ({ packageJson, packageLockJsonContents }) => {
  if (!packageLockJsonContents) {
    return;
  }

  if (packageLockJsonContents.includes(localRegistryURl)) {
    console.error(
      `\x1b[31m[Error] package-lock.json for "${packageJson.name}" contains local registry URL.\x1b[0m`
    );
    process.exit(1);
  }
});
