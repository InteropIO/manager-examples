import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { useRemoteRegistryNpmrc } from './helpers/use-npmrc.js';
import { setupZx } from './helpers/setup-zx.js';
import { packageScope } from './helpers/variables.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  await useRemoteRegistryNpmrc(async () => {
    await $`npm install`;

    const packageNames = Object.keys(packageJson.dependencies).filter((x) =>
      x.startsWith(`${packageScope}/`)
    );

    for (const packageName of packageNames) {
      await $`npm install ${packageName}`;
    }
  });

  console.log();
}
