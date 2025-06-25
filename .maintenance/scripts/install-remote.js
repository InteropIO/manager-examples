import process from 'node:process';

import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';
import { packageScope } from './helpers/variables.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();
parseOptions();

await visitPackages(async ({ packageJson }) => {
  if (process.env.CI_DEBUG === '1') {
    await $`npm install --loglevel verbose`;
  } else {
    await $`npm install`;
  }

  const packageNames = Object.keys(packageJson.dependencies ?? {}).filter((x) =>
    x.startsWith(`${packageScope}/`)
  );

  for (const packageName of packageNames) {
    const packageNameLatest = packageName + '@latest';

    if (process.env.CI_DEBUG === '1') {
      await $`npm install --loglevel verbose ${packageNameLatest}`;
    } else {
      await $`npm install ${packageNameLatest}`;
    }
  }

  await $`npm up --save`;

  await $`npm audit fix`.nothrow();
});
