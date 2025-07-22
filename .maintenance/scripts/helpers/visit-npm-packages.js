import { setupZx } from './zx.js';
import { findNpmPackages } from './find-npm-packages.js';
import { program } from 'commander';
import { parseCliArgs } from './parse-cli-args.js';
import { useCwd } from './use-current-dir.js';

program.option('-p, --packageName <packageName>', 'package name');

program.option(
  '-d, --packageDirectory <packageDirectory>',
  'package directory'
);

export async function visitNpmPackages(fn) {
  setupZx();

  const { packageName, packageDirectory } = parseCliArgs();

  const packages = await findNpmPackages(packageDirectory);

  if (packages.length === 0) {
    console.error('No packages found.');
    return;
  }

  for (const packageObject of packages) {
    if (packageName && packageObject.packageJson.name !== packageName) {
      continue;
    }

    await useCwd(packageObject.packagePath, async () => {
      console.log(
        `Switching to package "${packageObject.packageJson.name}"...`
      );

      await fn(packageObject);

      console.log();
    });
  }
}
