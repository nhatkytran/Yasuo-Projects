const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { mainCwd } = require('./utils');

const common = {
  entry: mainCwd('src/js/index.js'),
  output: {
    path: mainCwd('dist'),
    filename: '[name].[contenthash:12].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // This will clean the 'dist' folder on each build
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: mainCwd('index.html'),
    }),
  ],
};

module.exports = common;
