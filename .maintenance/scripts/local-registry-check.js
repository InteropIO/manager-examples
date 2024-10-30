import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { localRegistryURl } from './helpers/variables.js';

const options = program.parse().opts();

await visitPackages(
  options.package,
  async ({ packageJson, packageLockJsonContents }) => {
    if (!packageLockJsonContents) {
      return;
    }

    if (packageLockJsonContents.includes(localRegistryURl)) {
      console.error(
        `\x1b[31m[Error] package-lock.json for "${packageJson.name}" contains local registry URL.\x1b[0m`
      );
      process.exit(1);
    }
  }
);
