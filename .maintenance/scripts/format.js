import path from 'node:path';
import url from 'node:url';

import { $ } from 'zx/core';

import { visitPackages } from './helpers/visit-packages.js';
import { setupZx } from './helpers/setup-zx.js';
import { parseOptions } from './helpers/parse-options.js';

setupZx();

const options = parseOptions();

await visitPackages(async () => {
  await $`npm run format`;
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

if (!options.packageName && !options.packageDirectory) {
  $.cwd = path.resolve(__dirname, '../../');
  await $`npx -y prettier --write **/*.md`;
}
