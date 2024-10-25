import { $ } from 'zx';

import { getPackages } from './helpers/get-packages.js';
import { setupZx } from './helpers/setup-zx.js';

setupZx();

for (const { directoryPath, packageJson } of await getPackages()) {
  const packageNames = Object.keys(packageJson.dependencies).filter((x) =>
    x.startsWith('@interopio/')
  );

  if (packageNames.includes('@interopio/manager')) {
    continue;
  }

  $.cwd = directoryPath;
  console.log(`Switching to package "${packageJson.name}"...`);

  $.env['DEBUG_START_STOP'] = 'true';

  await $`npm run start`;

  console.log();
}
