import path from 'node:path';
import fs from 'node:fs/promises';

import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { localRegistryURl } from './helpers/variables.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  const packageLockJsonPath = path.join(directoryPath, 'package-lock.json');

  const packageLockJson = (await fs.readFile(packageLockJsonPath)).toString();

  if (packageLockJson.includes(localRegistryURl)) {
    console.error(
      `\x1b[31m[Error] package-lock.json for "${packageJson.name}" contains local registry URL.\x1b[0m`
    );
    process.exit(1);
  }

  console.log();
}
