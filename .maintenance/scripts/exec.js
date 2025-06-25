import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();

program
  .option('-c, --command <command>', 'Command')
  .option('-n, --nothrow', 'No throw');

const options = parseOptions();

await visitPackages(async () => {
  let proc = $`${options.command}`;

  if (options.nothrow) {
    proc = proc.nothrow();
  }

  await proc;
});
