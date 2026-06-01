// Parcel 2.x's dev packager defers a dependency when its asset has
// `sideEffects: false` plus a namespace re-export. `zod/v4/mini/index.js` does
// exactly that: it re-exports `* from './external.js'` and ships with
// `"sideEffects": false`. The result is that `_mini.z` is replaced by an empty
// `{}` stub at runtime, which breaks the entire `@interopio/manager-api`
// surface in dev mode.
//
// This script walks the `zod` package, finds every nested `package.json` (the
// root one, plus the per-subpath ones like `zod/mini`, `zod/v4`,
// `zod/v4/mini`, `zod/v4/classic`, `zod/v4/core`, `zod/v4/locales`) and
// removes the `"sideEffects": false` declaration from each. It is idempotent
// and only touches entries that are explicitly `false` - other shapes (arrays,
// `true`) are left untouched.
//
// See https://github.com/oven-sh/bun/issues/27709 for a similar class of bug
// caused by aggressive `sideEffects: false` declarations.

import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);

function findPackageJsonFiles(rootDir) {
  const out = [];

  function walk(dir) {
    const entries = readdirSync(dir);

    if (entries.includes('package.json')) {
      out.push(join(dir, 'package.json'));
    }

    for (const entry of entries) {
      if (entry === 'node_modules' || entry.startsWith('.')) {
        continue;
      }

      const full = join(dir, entry);
      const stat = statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      }
    }
  }

  walk(rootDir);
  return out;
}

function patchPackageJson(pkgJsonPath, label) {
  const raw = readFileSync(pkgJsonPath, 'utf8');
  const pkg = JSON.parse(raw);

  if (pkg.sideEffects !== false) {
    return false;
  }

  delete pkg.sideEffects;
  writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(
    `[patch-zod-side-effects] ${label}: removed "sideEffects: false".`
  );
  return true;
}

const zodPkgJson = require.resolve('zod/package.json');
const zodDir = dirname(zodPkgJson);
const allPkgJsons = findPackageJsonFiles(zodDir);

let patched = 0;

for (const pkgJsonPath of allPkgJsons) {
  const label = `zod/${relative(zodDir, dirname(pkgJsonPath)).replace(
    /\\/g,
    '/'
  )}`.replace(/\/$/, '');

  if (patchPackageJson(pkgJsonPath, label || 'zod')) {
    patched += 1;
  }
}

if (patched === 0) {
  console.log(
    `[patch-zod-side-effects] no changes needed (already patched in ${allPkgJsons.length} package.json files).`
  );
} else {
  console.log(
    `[patch-zod-side-effects] patched ${patched} of ${allPkgJsons.length} package.json files under ${zodDir}.`
  );
}
