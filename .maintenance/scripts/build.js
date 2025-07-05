import { $ } from 'zx';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';

await init();

await visitNpmPackages(async () => {
  await $`npm run build --if-present`;
});
