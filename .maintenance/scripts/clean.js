import path from 'node:path';
import fs from 'node:fs/promises';

import { $ } from 'zx';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';

await init();

$.cwd = path.resolve(import.meta.dirname, '..', '..');

await $`git clean -dfX -e "!**/*.local" -e "!.idea/**" -e "!.maintenance/**"`;

await visitNpmPackages(async ({ packagePath }) => {
  const packageLockPath = path.join(packagePath, 'package-lock.json');

  try {
    await fs.rm(packageLockPath, { recursive: true, force: true });
  } catch (error) {
    console.warn(
      `\x1b[33m[WARNING] Failed to delete file "${packageLockPath}"\x1b[0m`
    );
  }
});
