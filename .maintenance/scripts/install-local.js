import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';
import { packageScope } from './helpers/variables.js';
import process from 'node:process';

const options = program.parse().opts();

await visitPackages(options.package, async ({ packageJson }) => {
  await useLocalRegistryNpmrc(async () => {
    if (process.env.CI_DEBUG === '1') {
      await $`npm install --loglevel verbose`;
    } else {
      await $`npm install`;
    }

    const packageNames = Object.keys(packageJson.dependencies ?? {}).filter(
      (x) => x.startsWith(`${packageScope}/`)
    );

    for (const packageName of packageNames) {
      const packageNameLatest = packageName + '@latest';

      if (process.env.CI_DEBUG === '1') {
        await $`npm install --loglevel verbose ${packageNameLatest}`;
      } else {
        await $`npm install ${packageNameLatest}`;
      }
    }
  });
});
