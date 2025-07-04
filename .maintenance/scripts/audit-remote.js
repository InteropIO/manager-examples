import { $ } from 'zx/core';

import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();
parseOptions();

await visitNpmPackages(async () => {
  await $`npm audit fix`;
});
