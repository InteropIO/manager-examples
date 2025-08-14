import path from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';

const excludePatterns = ['!**/*.local', '!**/.idea/**', '!**/.npmrc'];

const child = spawn(
  'git',
  ['clean', '-dfX', ...excludePatterns.flatMap((x) => ['-e', x])],
  {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: path.resolve(import.meta.dirname, '..', '..'),
  }
);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on('close', process.exit);
child.on('error', (error) => {
  throw new Error(`Failed to spawn process.`, { cause: error });
});
