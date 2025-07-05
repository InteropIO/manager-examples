import path from 'node:path';
import { $ } from 'zx';
import fs from 'node:fs/promises';
import { interdependencies } from './variables.js';
import { EnvironmentVariables } from './env/environment-variables.js';

export async function useNpmOverwrites(fn) {
  if (!EnvironmentVariables.NPM_SCOPED_PACKAGES_FORCE_LATEST_VERSIONS) {
    return await fn();
  }

  const packageJSONPath = path.join($.cwd, 'package.json');

  let packageJSON = JSON.parse(
    (await fs.readFile(packageJSONPath, 'utf-8')).toString()
  );

  const oldOverrides = packageJSON.overrides;

  const tempPackageJSON = structuredClone(packageJSON);

  tempPackageJSON.overrides = {};

  for (const [name, deps] of Object.entries(interdependencies)) {
    if (
      name in (tempPackageJSON.dependencies || {}) ||
      name in (tempPackageJSON.devDependencies || {})
    ) {
      for (const dep of deps) {
        if (!tempPackageJSON.overrides[name]) {
          tempPackageJSON.overrides[name] = {};
        }
        tempPackageJSON.overrides[name][dep] = 'latest';
      }
    }
  }

  if (
    JSON.stringify(oldOverrides || {}) ===
    JSON.stringify(tempPackageJSON.overrides)
  ) {
    return await fn();
  }

  try {
    await fs.writeFile(
      packageJSONPath,
      JSON.stringify(tempPackageJSON, null, 2) + '\n'
    );
    return await fn();
  } finally {
    // Read package.json again
    packageJSON = JSON.parse(
      (await fs.readFile(packageJSONPath, 'utf-8')).toString()
    );

    // Restore the original overrides
    packageJSON.overrides = oldOverrides;

    await fs.writeFile(
      packageJSONPath,
      JSON.stringify(packageJSON, null, 2) + '\n'
    );
  }
}
