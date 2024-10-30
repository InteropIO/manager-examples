import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';

const options = program
  .option('-c, --command <command>', 'Command')
  .option('-n, --nothrow', 'No throw')
  .parse()
  .opts();

await visitPackages(options.package, async () => {
  if (options.nothrow) {
    await $([options.command]).nothrow();
  } else {
    await $([options.command]);
  }
});
