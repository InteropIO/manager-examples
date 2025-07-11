export function formatEnvFile(envObject) {
  const envOverridesString =
    Object.entries(envObject)
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join('\n') + '\n';

  return envOverridesString;
}
