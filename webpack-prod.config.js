
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/frontend/index.js'
  ],
  output: {
     path: path.join(__dirname, 'build', 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Engine',
      filename: 'index.html',
      template: 'src/frontend/index.template.html',
      inject: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
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
        include: path.join(__dirname, 'src', 'frontend','assets','styles'),
        loaders: ['style', 'css', 'sass']
      }
  
    ]
  }
}