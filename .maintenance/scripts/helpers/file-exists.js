import fs from 'node:fs/promises';

export async function fileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);

    if (!stats.isFile()) {
      throw new Error(
        `Path "${filePath}" resolved to something that is not a file.`
      );
    }

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      throw error;
    }
  }
}
