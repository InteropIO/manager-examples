import path from 'node:path';
import { $ } from 'zx';
import fs from 'node:fs/promises';
import { interdependencies } from './variables.js';

export async function useNpmOverwrites(fn) {
  const packageJSONPath = path.join($.cwd, 'package.json');

  const packageJSON = JSON.parse(
    (await fs.readFile(packageJSONPath, 'utf-8')).toString()
  );

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

  if (!Object.keys(tempPackageJSON.overrides).length) {
    await fn();
    return;
  }

  try {
    await fs.writeFile(
      packageJSONPath,
      JSON.stringify(tempPackageJSON, null, 2) + '\n'
    );
    await fn();
  } finally {
    await fs.writeFile(
      packageJSONPath,
      JSON.stringify(packageJSON, null, 2) + '\n'
    );
  }
}
