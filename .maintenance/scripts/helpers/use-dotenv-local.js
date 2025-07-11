import { useFileContents } from './file-mod.js';

export async function useDotEnvLocal(env, fn) {
  const envOverridesString =
    Object.entries(env)
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join('\n') + '\n';

  return await useFileContents('.env.local', envOverridesString, fn);
}
