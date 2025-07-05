import { $ } from 'zx';

import { init } from './helpers/init.js';
import { packageScope } from './helpers/variables.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { useDotEnvLocal } from './helpers/use-dotenv-local.js';
import { fileExists } from './helpers/file-exists.js';
import { EnvironmentVariables } from './helpers/env/environment-variables.js';

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
      await useDotEnvLocal(
        {
          API_LICENSE_KEY: EnvironmentVariables.API_LICENSE_KEY,
        },
        async () => {
          await test();
        }
      );
    } else {
      await test();
    }
  }
});
