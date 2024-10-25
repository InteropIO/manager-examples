import { $ } from 'zx/core';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await $`npx -y rimraf node_modules`;
  await $`npx -y rimraf dist`;
  await $`npx -y rimraf logs`;

  await $`npx -y rimraf package-lock.json`;
  await $`npx -y rimraf .npmrc`;

  console.log();
}
