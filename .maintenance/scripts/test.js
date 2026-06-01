import { $ } from 'zx';

import { init } from './helpers/init.js';
import { packageScope } from './helpers/variables.js';
import { visitNpmPackages } from './helpers/visit-npm-packages.js';
import { withInjectedLicense } from './helpers/with-injected-license.js';

await init();

const ignoreList = ['manager-examples', 'server-template'];

await visitNpmPackages(async ({ packageJson, packagePath }) => {
  if (ignoreList.includes(packageJson.name)) {
    return;
  }

  const directDependencies = Object.keys(packageJson.dependencies || {}).filter(
    (x) => x.startsWith(`${packageScope}/`)
  );

  // If the repo is based on the server package - start and stop the server.
  if (directDependencies.includes('@interopio/manager')) {
    await withInjectedLicense(packagePath, async () => {
      $.env.__SERVER_INITIALIZATION_TEST__ = 'true';
      await $`node dist/index.js`;
    });
  }
});
