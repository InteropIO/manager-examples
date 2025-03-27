import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function fileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);

    if (!stats.isFile()) {
      throw new Error(
        `Path "${filePath}" resolved to something that is not a file.`
      );
    }

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      throw error;
    }
  }
}

async function getPackagesRecursively(inputDirectory, result = []) {
  const directoryEntries = await fs.readdir(inputDirectory);

  for (const directoryEntry of directoryEntries) {
    if (directoryEntry.startsWith('.') || directoryEntry === 'node_modules') {
      continue;
    }

    const entryPath = path.join(inputDirectory, directoryEntry);

    if (!(await fs.stat(entryPath)).isDirectory()) {
      continue;
    }

    const packageJsonPath = path.join(entryPath, 'package.json');
    if (await fileExists(packageJsonPath)) {
      const packageJsonContents = (
        await fs.readFile(packageJsonPath)
      ).toString();

      const packageJson = JSON.parse(packageJsonContents);

      const packageLockJsonPath = path.join(entryPath, 'package-lock.json');

      let packageLockJson;
      let packageLockJsonContents;

      if (await fileExists(packageLockJsonPath)) {
        packageLockJsonContents = (
          await fs.readFile(packageLockJsonPath)
        ).toString();

        packageLockJson = JSON.parse(packageLockJsonContents);
      }

      result.push({
        packagePath: entryPath,
        packageJson,
        packageJsonContents,
        packageLockJson,
        packageLockJsonContents,
      });

      await getPackagesRecursively(entryPath, result);
    } else {
      await getPackagesRecursively(entryPath, result);
    }
  }

  return result;
}

export async function getPackages() {
  return getPackagesRecursively(path.resolve(__dirname, '../../../'));
}
