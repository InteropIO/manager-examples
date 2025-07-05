import { $ } from 'zx';
import path from 'node:path';

import { packageScope } from './variables.js';
import { useFileContents } from './file-mod.js';
import { EnvironmentVariables } from './env/environment-variables.js';

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

export async function useNpmrc(fn) {
  const url = EnvironmentVariables.NPM_SCOPED_PACKAGES_REGISTRY_URL;

  if (!url) {
    return await fn();
  }

  const authToken = EnvironmentVariables.NPM_SCOPED_PACKAGES_REGISTRY_TOKEN;

  const npmFilePath = path.join($.cwd, '.npmrc');
  const npmFileContents = createNpmrcFile({
    url,
    global: false,
    scopes: [packageScope],
    attributes: {
      _authToken: authToken,
    },
  });

  return useFileContents(npmFilePath, npmFileContents, fn);
}
