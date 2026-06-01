import { build } from 'esbuild';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'dist');

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [resolve(__dirname, 'src/index.tsx')],
  bundle: true,
  outfile: resolve(outDir, 'index.js'),
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  loader: {
    '.css': 'css',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
    '.svg': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.gif': 'file',
  },
  sourcemap: true,
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

await copyFile(resolve(__dirname, 'index.html'), resolve(outDir, 'index.html'));

console.log(`Build complete. Output: ${outDir}`);
