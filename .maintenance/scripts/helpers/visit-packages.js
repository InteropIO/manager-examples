import { $ } from 'zx';

import { setupZx } from './setup-zx.js';
import { getPackages } from './get-packages.js';
import { program } from 'commander';
import { parseOptions } from './parse-options.js';

program.option('-p, --packageName <packageName>', 'package name');

program.option(
  '-d, --packageDirectory <packageDirectory>',
  'package directory'
);

export async function visitPackages(fn) {
  setupZx();

  const options = parseOptions();

  const { packageName, packageDirectory } = options;

  const packages = await getPackages(packageDirectory);

  for (const packageObject of packages) {
    if (packageName && packageObject.packageJson.name !== packageName) {
      continue;
    }

    $.cwd = packageObject.packagePath;
    console.log(`Switching to package "${packageObject.packageJson.name}"...`);

    await fn(packageObject);

    console.log();
  }
}
