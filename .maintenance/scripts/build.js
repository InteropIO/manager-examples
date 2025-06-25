import { $ } from 'zx';

import { visitPackages } from './helpers/visit-packages.js';
import { parseOptions } from './helpers/parse-options.js';

parseOptions();

const ignoreList = ['io-manager-template'];

await visitPackages(async ({ packageJson }) => {
  if (!ignoreList.includes(packageJson.name)) {
    await $`npm run build`;
  }
});
