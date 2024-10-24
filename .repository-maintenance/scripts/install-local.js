import { $, usePowerShell } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';

usePowerShell();

$.verbose = true;

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await useLocalRegistryNpmrc(async () => {
    await $`npm install`;
  });

  console.log();
}
