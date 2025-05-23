import { $ } from 'zx';
import { program } from 'commander';

import { packageScope } from './helpers/variables.js';
import { visitPackages } from './helpers/visit-packages.js';

const options = program.parse().opts();

const ignoreList = ['io-manager-template', 'server-template'];

await visitPackages(options.package, async ({ packageJson }) => {
  if (ignoreList.includes(packageJson.name)) {
    return;
  }

  const directDependencies = Object.keys(packageJson.dependencies || {}).filter(
    (x) => x.startsWith(`${packageScope}/`)
  );

  // If the repo is based on the server package - start and stop the server.
  if (directDependencies.includes('@interopio/manager')) {
    $.env.__SERVER_INITIALIZATION_TEST__ = 'true';
    await $`npm run start`;
  }
});
