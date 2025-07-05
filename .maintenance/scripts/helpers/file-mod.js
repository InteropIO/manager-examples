import path from 'node:path';
import fs from 'node:fs/promises';
import { fileExists } from './file-exists.js';

async function useLockFile(lockFilePath, fn) {
  try {
    await fs.writeFile(lockFilePath, '', { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(`Lock file already exists: "${lockFilePath}"`, {
        cause: error,
      });
    }

    throw error;
  }

  const result = await fn();

  await fs.rm(lockFilePath);

  return result;
}

async function useBackupFile(filePath, fn) {
  const fullFilePath = path.resolve(filePath);
  const fullBackupFilePath = fullFilePath + '.backup';

  try {
    await fs.copyFile(
      fullFilePath,
      fullBackupFilePath,
      fs.constants.COPYFILE_EXCL
    );
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(`Backup file already exists: "${filePath}"`, {
        cause: error,
      });
    }

    throw error;
  }

  let result;

  try {
    result = await fn();
  } finally {
    // Restore the original file from the backup
    await fs.copyFile(fullBackupFilePath, fullFilePath);

    // Remove the backup file
    await fs.rm(fullBackupFilePath);
  }

  return result;
}

async function useFile(filePath, fileContents, fn) {
  const fullFilePath = path.resolve(filePath);

  await fs.writeFile(fullFilePath, fileContents);

  try {
    return await fn();
  } finally {
    await fs.rm(fullFilePath);
  }
}

export async function useFileContents(filePath, fileContents, fn) {
  const fullFilePath = path.resolve(filePath);

  if (await fileExists(fullFilePath)) {
    return useBackupFile(fullFilePath, async () => {
      await fs.writeFile(fullFilePath, fileContents);
      return await fn();
    });
  } else {
    return useFile(fullFilePath, fileContents, fn);
  }
}

export async function useProcessedFile(filePath, processFunction, fn) {
  const fullFilePath = path.resolve(filePath);

  if (!(await fileExists(fullFilePath))) {
    throw new Error(`File not found: "${fullFilePath}"`);
  }

  const fileContents = (await fs.readFile(fullFilePath)).toString();

  const modifiedContents = await processFunction(fileContents);

  return await useFileContents(fullFilePath, modifiedContents, fn);
}
