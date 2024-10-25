import { $ } from 'zx';
import fs from 'node:fs/promises';
import path from 'node:path';

async function useNpmrc(contents, fn) {
  const npmrcPath = path.join($.cwd, '.npmrc');
  try {
    await fs.writeFile(npmrcPath, contents);
    await fn();
  } finally {
    await fs.rm(npmrcPath);
  }
}

function removeProtocol(url) {
  const separator = '//';
  return url.substring(url.indexOf(separator) + separator.length);
}

function createNpmrcFile(options) {
  const registryWithoutProtocol = removeProtocol(options.url);

  let contents = '';

  if (options.global) {
    contents += `registry=${options.url}\n`;
  }

  for (const scope of options.scopes ?? []) {
    contents += `${scope}:registry=${options.url}\n`;
  }

  for (const [key, value] of Object.entries(options.attributes ?? {})) {
    contents += `//${registryWithoutProtocol}/:${key}=${value}\n`;
  }

  return contents;
}

export async function useLocalRegistryNpmrc(fn) {
  await useNpmrc(
    createNpmrcFile({
      url: 'http://localhost:4873',
      global: false,
      scopes: ['@interopio'],
      attributes: {
        _authToken: 'fake-token',
      },
    }),
    fn
  );
}

export async function useJfrogRegistryNpmrc(fn) {
  await useNpmrc(
    createNpmrcFile({
      url: 'https://glue42.jfrog.io/artifactory/api/npm/default-npm-virtual',
      global: false,
      scopes: ['@interopio'],
      attributes: {
        _authToken: process.env['JFROG_TOKEN'],
        'always-auth': 'true',
      },
    }),
    fn
  );
}
