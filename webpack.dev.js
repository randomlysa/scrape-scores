const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'app.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './src'
  }
});
