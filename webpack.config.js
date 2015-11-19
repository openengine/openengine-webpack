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
    // This allows us to use ENV variables in our react code..
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'GRAPHQL_SERVER',
    ]),
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
        include: [path.join(__dirname, 'src', 'frontend')],
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, 'src', 'frontend')],
        loaders: ['react-hot', 'babel?stage=1&plugins[]=' + path.join(__dirname, 'relayPlugin')],
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
