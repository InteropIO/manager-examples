import process from 'node:process';

import { visitPackages } from './helpers/visit-packages.js';
import { localRegistryURl } from './helpers/variables.js';
import { parseOptions } from './helpers/parse-options.js';

parseOptions();

await visitPackages(async ({ packageJson, packageLockJsonContents }) => {
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
