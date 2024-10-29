import path from 'node:path';
import fs from 'node:fs/promises';

import { $ } from 'zx';

import { packageScope } from './helpers/variables.js';
import { visitPackages } from './helpers/visit-packages.js';

async function patchIndexTs(indexTsPath) {
  const indexTsContents = (await fs.readFile(indexTsPath)).toString();

  const lines = indexTsContents.split('\n');

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i].trim();

    if (line) {
      if (line === 'start(config);') {
        lines[i] = 'start(config).then(server => server.stop());';
      }

      break;
    }
  }

  return lines.join('\n');
}

await visitPackages(async ({ packageJson }) => {
  const directDependencies = Object.keys(packageJson.dependencies).filter((x) =>
    x.startsWith(`${packageScope}/`)
  );

  // If the repo is based on the server package - start and stop the server.
  if (directDependencies.includes('@interopio/manager')) {
    const indexTsPath = path.join($.cwd, 'src/index.ts');
    const indexTsBackupPath = indexTsPath + '.backup';
    const indexTsContents = await patchIndexTs(indexTsPath);
    try {
      await fs.copyFile(indexTsPath, indexTsBackupPath);
      await fs.writeFile(indexTsPath, indexTsContents);

      await $`npm run start`;
    } finally {
      await fs.copyFile(indexTsBackupPath, indexTsPath);
      await fs.rm(indexTsBackupPath);
    }

    // If the repo is based on the Admin UI package - just build it.
  } else if (directDependencies.includes('@interopio/manager-admin-ui')) {
    await $`npm run build`;
  }
});
