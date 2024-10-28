import { $ } from 'zx';
import { setupZx } from './setup-zx.js';
import { getPackages } from './get-packages.js';

export async function visitPackages(fn) {
  setupZx();

  for (const packageObject of await getPackages()) {
    $.cwd = packageObject.packagePath;
    console.log(`Switching to package "${packageObject.packageJson.name}"...`);

    await fn(packageObject);

    console.log();
  }
}
