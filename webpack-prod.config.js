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
      { test: /\.jsx$/,
        loaders: ['babel?stage=0&plugins[]=' + path.join(__dirname, 'relayPlugin')],
        include: [path.join(__dirname, 'src', 'frontend'), path.join(__dirname, 'src', 'server/data')],
      },
      { test: /\.js$/,
        loaders: ['babel?stage=0&plugins[]=' + path.join(__dirname, 'relayPlugin')],
        include: [path.join(__dirname, 'src', 'frontend'), path.join(__dirname, 'src', 'server/data')],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src', 'frontend', 'assets', 'styles'),
        loaders: ['style', 'css'],
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
        loader: 'babel?stage=0',
      },
    ],
  },
});

module.exports = [frontendConfig, serverConfig];
