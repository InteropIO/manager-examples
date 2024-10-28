import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { packageScope } from './helpers/variables.js';
import path from 'node:path';
import fs from 'node:fs/promises';

setupZx();

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

for (const { directoryPath, packageJson } of await getPackages()) {
  const packageNames = Object.keys(packageJson.dependencies).filter((x) =>
    x.startsWith(`${packageScope}/`)
  );

  if (!packageNames.includes('@interopio/manager')) {
    continue;
  }

  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

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

  console.log();
}
