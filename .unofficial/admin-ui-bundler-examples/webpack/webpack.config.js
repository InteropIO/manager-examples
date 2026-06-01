const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        // guarded at runtime; disable webpack's strict import-presence check for that
        // package so the production build succeeds.
        {
          test: /node_modules[\\/]@interopio[\\/]manager-admin-ui/,
          parser: { importExportsPresence: false },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              // The example uses `noEmit: true` for editor type-checking and
              // delegates emit to the bundler — ts-loader needs emit enabled.
              compilerOptions: { noEmit: false },
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
    ],
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
