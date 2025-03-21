import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';

const options = program.parse().opts();

await visitPackages(options.package, async () => {
  await $`npm run format`;
});
