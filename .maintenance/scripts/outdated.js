import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';
import { useLocalRegistryNpmrc } from './helpers/use-npmrc.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();
parseOptions();

await visitPackages(async () => {
  await useLocalRegistryNpmrc(async () => {
    await $`npm outdated`.nothrow();
  });
});
