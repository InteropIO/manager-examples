import { $ } from 'zx';

import { init } from './helpers/init.js';
import { packageScope } from './helpers/variables.js';
import { EnvironmentVariables } from './helpers/env/environment-variables.js';
import { findNpmPackages } from './helpers/find-npm-packages.js';

await init();

const workspaceByDepName = {};

for (const { packageJson } of await findNpmPackages()) {
  for (const depName of Object.keys(packageJson.dependencies ?? {})) {
    if (depName.startsWith(`${packageScope}/`)) {
      workspaceByDepName[depName] ??= [];
      workspaceByDepName[depName].push(packageJson.name);
    }
  }
}

for (const [depName, workspaceNames] of Object.entries(workspaceByDepName)) {
  const packageNameLatest = depName + '@latest';

  let command = `npm install ${packageNameLatest} ${workspaceNames.flatMap((x) => `--workspace ${x}`).join(' ')}`;

  if (EnvironmentVariables.CI_DEBUG === '1') {
    command += ' --loglevel verbose';
  }

  await $`${command}`;
}
