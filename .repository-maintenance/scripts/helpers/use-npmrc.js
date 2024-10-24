import { $ } from 'zx';
import fs from 'node:fs/promises';
import path from 'node:path';

async function useNpmrc(contents, fn) {
  const npmrcPath = path.join($.cwd, '.npmrc');
  await fs.writeFile(npmrcPath, contents);
  await fn();
  await fs.rm(npmrcPath);
}

function createNpmrcFile(options) {
  let npmrcContents = '';
  npmrcContents += `${options.scope}:registry=${options.url}\n`;
  npmrcContents += `//${options.url}/:_authToken=${options.token}\n`;
  return npmrcContents;
}

export async function useLocalRegistryNpmrc(fn) {
  await useNpmrc(
    createNpmrcFile({
      url: 'http://localhost:4873',
      scope: '@interopio',
      token: 'fake-token',
    }),
    fn
  );
}
export async function useJfrogRegistryNpmrc(fn) {
  await useNpmrc(
    createNpmrcFile({
      url: 'https://glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/',
      scope: '@interopio',
      token: process.env['JFROG_TOKEN'],
    }),
    fn
  );
}
