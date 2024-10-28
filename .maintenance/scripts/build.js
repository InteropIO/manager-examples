import { $ } from 'zx';

import { visitPackages } from './helpers/visit-packages.js';

await visitPackages(async () => {
  await $`npm run build`;
});
