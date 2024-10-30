import { $ } from 'zx';
import { setupZx } from './setup-zx.js';
import { getPackages } from './get-packages.js';
import { program } from 'commander';

program.option('-p, --package <package name>', 'package name');

export async function visitPackages(packageName, fn) {
  setupZx();

  for (const packageObject of await getPackages()) {
    if (packageName && packageObject.packageJson.name !== packageName) {
      return;
    }

    $.cwd = packageObject.packagePath;
    console.log(`Switching to package "${packageObject.packageJson.name}"...`);

    await fn(packageObject);

    console.log();
  }
}
