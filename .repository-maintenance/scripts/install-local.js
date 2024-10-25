import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';
import { setupZx } from './helpers/setup-zx.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await useLocalRegistryNpmrc(async () => {
    await $`npm install`;
  });

  console.log();
}
