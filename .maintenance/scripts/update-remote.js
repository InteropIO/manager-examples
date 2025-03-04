import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';
import { packageScope } from './helpers/variables.js';

const options = program.parse().opts();

await visitPackages(options.package, async ({ packageJson }) => {
  await $`npm up --save`;

  const packageNames = Object.keys(packageJson.dependencies ?? {}).filter((x) =>
    x.startsWith(`${packageScope}/`)
  );

  for (const packageName of packageNames) {
    await $`npm install ${packageName}`;
  }

  await $`npm audit fix`.nothrow();
});
