import fsSync from 'node:fs';

import dotenv from 'dotenv';

export function readDotEnvFiles() {
  const fileNames = ['.env', '.env.local'];

  const availableFileNames = fileNames.filter(fsSync.existsSync);

  if (availableFileNames.length) {
    const result = dotenv.config({
      path: availableFileNames,
      quiet: true,
      override: true,
    });

    if (result.error) {
      throw result.error;
    }
  }
}
