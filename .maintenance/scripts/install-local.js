import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';
import { packageScope } from './helpers/variables.js';

const options = program.parse().opts();

await visitPackages(options.package, async ({ packageJson }) => {
  await useLocalRegistryNpmrc(async () => {
    await $`npm install`;

    const packageNames = Object.keys(packageJson.dependencies ?? {}).filter(
      (x) => x.startsWith(`${packageScope}/`)
    );

    for (const packageName of packageNames) {
      const packageNameLatest = packageName + '@latest';

      await $`npm install ${packageNameLatest}`;
    }

    await $`npm up --save`;

    await $`npm audit fix`.nothrow();
  });
});
