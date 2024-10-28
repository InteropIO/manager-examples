import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';

await visitPackages(async () => {
  await $`npm run format`;
});
