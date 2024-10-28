import { $ } from 'zx';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  localRegistryURl,
  packageScope,
  remoteRegistryURL,
} from './variables.js';

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
      url: localRegistryURl,
      global: false,
      scopes: [packageScope],
      attributes: {
        _authToken: '${VERDACCIO_TOKEN}',
      },
    }),
    fn
  );
}

export async function useRemoteRegistryNpmrc(fn) {
  await useNpmrc(
    createNpmrcFile({
      url: remoteRegistryURL,
      global: false,
      scopes: [packageScope],
      attributes: {
        _authToken: '${JFROG_TOKEN}',
        'always-auth': 'true',
      },
    }),
    fn
  );
}
