import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';

await visitPackages(async () => {
  await $`npx -y rimraf node_modules`;
  await $`npx -y rimraf dist`;
  await $`npx -y rimraf logs`;

  await $`npx -y rimraf package-lock.json`;
  await $`npx -y rimraf .npmrc`;
});
