import { $ } from 'zx/core';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await $`rm ./node_modules -Recurse -Force -ErrorAction Ignore`;
  await $`rm ./dist -Recurse -Force -ErrorAction Ignore`;
  await $`rm ./logs -Recurse -Force -ErrorAction Ignore`;
  await $`rm ./package-lock.json -ErrorAction Ignore`;
  await $`rm ./.npmrc -ErrorAction Ignore`;

  console.log();
}
