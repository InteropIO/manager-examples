import path from 'node:path';
import fs from 'node:fs/promises';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';

await init();

await visitNpmPackages(async ({ packagePath }) => {
  const allPaths = [
    path.join(packagePath, `node_modules`),
    path.join(packagePath, `dist`),
    path.join(packagePath, `logs`),
    path.join(packagePath, `package-lock.json`),
    path.join(packagePath, `.npmrc`),
  ];

  await Promise.allSettled(
    allPaths.map(async (dirPath) => {
      try {
        await fs.rm(dirPath, { recursive: true, force: true });
      } catch (error) {
        console.warn(
          `\x1b[33m[WARNING] Failed to delete directory "${path.relative(packagePath, dirPath)}"\x1b[0m`
        );
      }
    })
  );
});
