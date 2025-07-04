import { $ } from 'zx/core';

import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';
import { useNpmOverwrites } from './helpers/use-npm-overwrites.js';

setupZx();
parseOptions();

await visitNpmPackages(async () => {
  await useLocalRegistryNpmrc(async () => {
    await useNpmOverwrites(async () => {
      await $`npm up --save`;
      await $`npm audit fix`.nothrow();
    });
  });
});
