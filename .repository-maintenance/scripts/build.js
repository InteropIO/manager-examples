import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await $`npm run build`;

  console.log();
}
