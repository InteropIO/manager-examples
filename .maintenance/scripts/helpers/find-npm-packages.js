import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { fileExists } from './file-exists.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function findNpmPackagesRecursively(inputPath, result = []) {
  const fullInputPath = path.resolve(inputPath);

  const packageJsonPath = path.join(fullInputPath, 'package.json');

  if (await fileExists(packageJsonPath)) {
    const packageJsonContents = (await fs.readFile(packageJsonPath)).toString();
    const packageJson = JSON.parse(packageJsonContents);
    const packageLockJsonPath = path.join(fullInputPath, 'package-lock.json');

    let packageLockJson;
    let packageLockJsonContents;

    if (await fileExists(packageLockJsonPath)) {
      packageLockJsonContents = (
        await fs.readFile(packageLockJsonPath)
      ).toString();

      packageLockJson = JSON.parse(packageLockJsonContents);
    }

    result.push({
      packagePath: fullInputPath,
      packageJson,
      packageJsonContents,
      packageLockJson,
      packageLockJsonContents,
    });
  }

  const childPaths = await fs.readdir(fullInputPath);

  for (const childPath of childPaths) {
    if (!childPath.startsWith('.') && childPath !== 'node_modules') {
      const fullChildPath = path.join(fullInputPath, childPath);

      if ((await fs.stat(fullChildPath)).isDirectory()) {
        await findNpmPackagesRecursively(fullChildPath, result);
      }
    }
  }

  return result;
}

export async function findNpmPackages(directory) {
  const fullPath = path.resolve(__dirname, '../../../', directory || '');

  return findNpmPackagesRecursively(fullPath);
}
