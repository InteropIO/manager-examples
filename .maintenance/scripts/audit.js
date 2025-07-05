import { $ } from 'zx/core';

import { init } from './helpers/init.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { useNpmrc } from './helpers/use-npmrc.js';
import { useNpmOverwrites } from './helpers/use-npm-overwrites.js';

await init();

await visitNpmPackages(async () => {
  await useNpmrc(async () => {
    await useNpmOverwrites(async () => {
      await $`npm audit`;
    });
  });
});
