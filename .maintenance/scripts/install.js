import { $ } from 'zx/core';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { useNpmrc } from './helpers/use-npmrc.js';
import { packageScope } from './helpers/variables.js';
import { useNpmOverwrites } from './helpers/use-npm-overwrites.js';
import { EnvironmentVariables } from './helpers/env/environment-variables.js';

await init();

await visitNpmPackages(async ({ packageJson }) => {
  await useNpmrc(async () => {
    await useNpmOverwrites(async () => {
      if (EnvironmentVariables.CI_DEBUG === '1') {
        await $`npm install --loglevel verbose`;
      } else {
        await $`npm install`;
      }

      const packageNames = Object.keys(packageJson.dependencies ?? {}).filter(
        (x) => x.startsWith(`${packageScope}/`)
      );

      for (const packageName of packageNames) {
        const packageNameLatest = packageName + '@latest';

        if (EnvironmentVariables.CI_DEBUG === '1') {
          await $`npm install --loglevel verbose ${packageNameLatest}`;
        } else {
          await $`npm install ${packageNameLatest}`;
        }
      }
    });
  });
});
