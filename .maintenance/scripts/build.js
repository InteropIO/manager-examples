import { $ } from 'zx';

import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { parseOptions } from './helpers/parse-options.js';

parseOptions();

await visitNpmPackages(async () => {
  await $`npm run build --if-present`;
});
