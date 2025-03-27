import { $ } from 'zx';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';

const options = program.parse().opts();

const ignoreList = ['io-manager-template'];

await visitPackages(options.package, async ({ packageJson }) => {
  if (!ignoreList.includes(packageJson.name)) {
    await $`npm run build`;
  }
});
