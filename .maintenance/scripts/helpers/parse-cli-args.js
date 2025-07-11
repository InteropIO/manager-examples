import process from 'node:process';

import { program } from 'commander';

export function parseCliArgs() {
  const systemArgs = process.argv.slice(0, 2);
  const applicationArgs = process.argv.slice(2);

  while (applicationArgs[0] === '--') {
    applicationArgs.shift();
  }

  return program.parse([...systemArgs, ...applicationArgs]).opts();
}
