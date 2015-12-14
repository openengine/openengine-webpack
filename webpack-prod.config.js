const path = require('path');
const webpack = require('webpack');
const assign = require('object-assign');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = {
  devtool: 'sourcemap',
};

const frontendConfig = assign({}, defaultConfig, {
  devtool: 'source-map',
  entry: [
    './src/frontend/index.js',
  ],
  output: {
    path: path.join(__dirname, 'build', 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Engine',
      filename: 'index.html',
      template: 'src/frontend/index.template.html',
      inject: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      { test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [path.join(__dirname, 'relayPlugin'), 'transform-decorators-legacy'],
        },
        include: [path.join(__dirname, 'src', 'frontend')],
      },
    ],
  },
});

const serverConfig = assign({}, defaultConfig, {
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  // do not include polyfills or mocks for node stuff
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  // all non-relative modules are external
  // abc -> require('abc')
  externals: /^[a-z\-0-9]+$/,

  plugins: [
    // enable source-map-support by installing at the head of every chunk
    new webpack.BannerPlugin('require("source-map-support").install();',
      {raw: true, entryOnly: false}),
  ],

  module: {
    loaders: [
      {
        // transpile all .js files using babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy'],
        },
      },
    ],
  },
});

module.exports = [frontendConfig, serverConfig];
