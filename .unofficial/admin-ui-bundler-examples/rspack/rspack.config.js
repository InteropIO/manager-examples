const path = require('path');
const rspack = require('@rspack/core');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        // manager-admin-ui's published bundle statically references some symbols from
        // 'react' that the pinned React version does not export. The references are
        // guarded at runtime; disable Rspack's strict import-presence check for that
        // package so the production build succeeds.
        {
          test: /node_modules[\\/]@interopio[\\/]manager-admin-ui/,
          parser: { importExportsPresence: false },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
              target: 'es2020',
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.css$/i,
          type: 'css',
        },
      ],
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: './index.html',
      }),
    ],
    experiments: {
      css: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      port: 3000,
      host: '0.0.0.0',
      historyApiFallback: true,
      hot: true,
      open: false,
    },
  };
};
