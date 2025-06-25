import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();
parseOptions();

await visitPackages(async () => {
  await $`npm up --save`;
  await $`npm audit fix`.nothrow();
});
