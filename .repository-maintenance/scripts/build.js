import { $, usePowerShell } from 'zx';

import { getPackages } from './helpers/get-packages.js';

usePowerShell();

$.verbose = true;

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await $`npm run build`;

  console.log();
}
