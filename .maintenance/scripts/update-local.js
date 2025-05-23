import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';

const options = program.parse().opts();

await visitPackages(options.package, async ({ packageJson }) => {
  await useLocalRegistryNpmrc(async () => {
    await $`npm up --save`;
    await $`npm audit fix`.nothrow();
  });
});
