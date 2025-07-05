import { $ } from 'zx';

import { init } from './helpers/init.js';
import { packageScope } from './helpers/variables.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { fileExists } from './helpers/file-exists.js';
import { EnvironmentVariables } from './helpers/env/environment-variables.js';
import { useFileContents, useProcessedFile } from './helpers/file-mod.js';
import { formatEnvFile } from './helpers/env/format-env-file.js';

await init();

const ignoreList = ['server-template'];

await visitNpmPackages(async ({ packageJson }) => {
  if (ignoreList.includes(packageJson.name)) {
    return;
  }

  const directDependencies = Object.keys(packageJson.dependencies || {}).filter(
    (x) => x.startsWith(`${packageScope}/`)
  );

  // If the repo is based on the server package - start and stop the server.
  if (directDependencies.includes('@interopio/manager')) {
    async function test() {
      $.env.__SERVER_INITIALIZATION_TEST__ = 'true';
      await $`npm run start`;
    }

    if (await fileExists('.env')) {
      await useFileContents(
        '.env.local',
        formatEnvFile({
          API_LICENSE_KEY: EnvironmentVariables.API_LICENSE_KEY,
        }),
        async () => {
          await test();
        }
      );
    } else {
      await useProcessedFile(
        'src/index.ts',
        (contents) => {
          contents = contents.replaceAll(
            '<YOUR_LICENSE_KEY>',
            EnvironmentVariables.API_LICENSE_KEY
          );

          return contents;
        },
        async () => {
          await test();
        }
      );
    }
  }
});
