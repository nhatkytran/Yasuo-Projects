const { merge } = require('webpack-merge');

const { mainCwd } = require('./utils');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // faster than 'source-map' and good for development
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    port: 8080,
    static: {
      directory: mainCwd(),
    },
    devMiddleware: {
      index: 'index.html',
      writeToDisk: true, // By default, dist folder is created in memory
    },
    client: {
      overlay: true,
    },
    liveReload: false,
    hot: false,
  },
  // Browser keeps reloading so many times
  // https://github.com/webpack/webpack/issues/2983
  watchOptions: {
    aggregateTimeout: 500,
    poll: false,
  },
});
