import { context } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'dist');

// Make sure the served `dist/` exists and contains `index.html` before the
// watch loop starts - esbuild's `serve` falls back to a file inside `servedir`,
// so the HTML must already be on disk when the first request arrives.
await mkdir(outDir, { recursive: true });
await copyFile(resolve(__dirname, 'index.html'), resolve(outDir, 'index.html'));

const ctx = await context({
  entryPoints: [resolve(__dirname, 'src/index.tsx')],
  bundle: true,
  outdir: outDir,
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
  define: {
    'process.env.NODE_ENV': '"development"',
  },
});

await ctx.watch();

// Serve the `dist/` directory directly so dev and prod use the exact same
// asset layout (the production build copies `index.html` into `dist/` too).
// This keeps the HTML references (`/index.js`, `/index.css`) valid in both
// modes without rewriting paths between builds.
const { host, port } = await ctx.serve({
  port: 3000,
  host: '0.0.0.0',
  servedir: outDir,
  fallback: resolve(outDir, 'index.html'),
});

console.log(`Dev server listening on http://${host || 'localhost'}:${port}`);
