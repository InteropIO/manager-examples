import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';
import { useRemoteRegistryNpmrc } from './helpers/use-npmrc.js';
import { packageScope } from './helpers/variables.js';

await visitPackages(async ({ packageJson }) => {
  await useRemoteRegistryNpmrc(async () => {
    await $`npm install`;

    const packageNames = Object.keys(packageJson.dependencies).filter((x) =>
      x.startsWith(`${packageScope}/`)
    );

    for (const packageName of packageNames) {
      await $`npm install ${packageName}`;
    }

    await $`npm audit fix`.nothrow();
  });
});
