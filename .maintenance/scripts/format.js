import path from 'node:path';
import url from 'node:url';

import { $ } from 'zx/core';
import { program } from 'commander';

import { visitPackages } from './helpers/visit-packages.js';

const options = program.parse().opts();

await visitPackages(options.package, async () => {
  await $`npm run format`;
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

$.cwd = path.resolve(__dirname, '../../');
await $`npx -y prettier --write **/*.md`;
