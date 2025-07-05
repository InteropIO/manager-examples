import { $ } from 'zx/core';
import { program } from 'commander';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { parseCliArgs } from './helpers/parse-cli-args.js';

await init();

program
  .option('-c, --command <command>', 'Command')
  .option('-n, --nothrow', 'No throw');

const { command, nothrow } = parseCliArgs();

await visitNpmPackages(async () => {
  let proc = $`${command}`;

  if (nothrow) {
    proc = proc.nothrow();
  }

  await proc;
});
