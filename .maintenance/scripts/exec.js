import { $ } from 'zx/core';
import { program } from 'commander';

import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();

program
  .option('-c, --command <command>', 'Command')
  .option('-n, --nothrow', 'No throw');

const options = parseOptions();

await visitNpmPackages(async () => {
  let proc = $`${options.command}`;

  if (options.nothrow) {
    proc = proc.nothrow();
  }

  await proc;
});
