import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function getPackagesRecursively(inputDirectory, result = []) {
  const directoryEntries = await fs.readdir(inputDirectory);

  for (const directoryEntry of directoryEntries) {
    if (directoryEntry === '.repository-maintenance') {
      continue;
    }

    const entryPath = path.join(inputDirectory, directoryEntry);

    if ((await fs.stat(entryPath)).isDirectory()) {
      try {
        const packageJsonPath = path.join(entryPath, 'package.json');

        const stats = await fs.stat(packageJsonPath);

        if (!stats.isFile()) {
          throw new Error(
            `package.json found in directory "${entryPath}" but it is a file instead of a directory.`
          );
        }

        const packageJson = JSON.parse(
          (await fs.readFile(packageJsonPath)).toString()
        );

        result.push({
          directoryPath: entryPath,
          packageJson,
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          await getPackagesRecursively(entryPath, result);
        } else {
          throw error;
        }
      }
    }
  }

  return result;
}

export async function getPackages() {
  return getPackagesRecursively(path.resolve(__dirname, '../../../'));
}
