import { $ } from 'zx';

export async function useCwd(newCwd, fn) {
  const oldWd = process.cwd();
  const oldZxWd = $.cwd;

  try {
    process.chdir(newCwd);
    $.cwd = newCwd;

    return await fn();
  } finally {
    process.chdir(oldWd);
    $.cwd = oldZxWd;
  }
}
