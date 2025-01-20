import path from 'node:path';
import fs from 'node:fs/promises';

import { $ } from 'zx';
import { program } from 'commander';

import { packageScope } from './helpers/variables.js';
import { visitPackages } from './helpers/visit-packages.js';

const options = program.parse().opts();

async function patchIndexTs(indexTsPath) {
  const indexTsContents = (await fs.readFile(indexTsPath)).toString();

  const lines = indexTsContents.split('\n');

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i].trim();

    if (line) {
      if (line === 'start(config);') {
        lines[i] = 'start(config).then(server => server.stop());';
      }

      if (line === 'await start(config);') {
        lines[i] = 'const server = await start(config); await server.stop();';
      }

      if (line === '})().catch(console.error);') {
        lines[i] = 'await server.stop(); })().catch(console.error);';
      }

      break;
    }
  }

  return lines.join('\n');
}

await visitPackages(options.package, async ({ packageJson }) => {
  const directDependencies = Object.keys(packageJson.dependencies ?? {}).filter(
    (x) => x.startsWith(`${packageScope}/`)
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

    // If not - just build it.
  } else {
    await $`npm run build`;
  }
});
