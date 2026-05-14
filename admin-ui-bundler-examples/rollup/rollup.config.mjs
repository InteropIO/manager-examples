import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: 'index.js',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
      },
    }),
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      // The shared tsconfig has `noEmit: true` for editor type-checking;
      // Rollup needs the TypeScript plugin to actually emit JS.
      noEmit: false,
      jsx: 'react-jsx',
      include: ['src/**/*'],
    }),
    css({ inject: true }),
    copy({
      targets: [{ src: 'index.html', dest: 'dist' }],
    }),
    isProduction && terser(),
    !isProduction &&
      serve({
        contentBase: 'dist',
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: true,
      }),
    !isProduction && livereload('dist'),
  ].filter(Boolean),
};
