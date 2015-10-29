var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: '#source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
      resolve: {
          root: path.join(__dirname, 'src')
      },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: [/node_modules/, /flycheck/],
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'spec')]
    }, {
      test: /\.json$/,
      loaders: ['json'],
      exclude: /node_modules/,
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'spec')]
    }]
  }
};
