const webpack = require('webpack');
const path = require('path');
const assign = require('object-assign');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = {
  devtool: 'sourcemap',
};

const frontendConfig = assign({}, defaultConfig, {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/frontend/index.js',
  ],

  output: {
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/',
    path: path.join(__dirname, 'build', 'public'),
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Engine',
      filename: 'index.html',
      template: 'src/frontend/index.template.html',
      inject: true,
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, 'src', 'frontend')],
        loaders: ['react-hot', 'babel?stage=0&plugins[]=' + path.join(__dirname, 'relayPlugin')],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src', 'frontend', 'assets', 'styles'),
        loaders: ['style', 'css'],
      },
    ],
  },
});

module.exports = [frontendConfig];
