const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new BundleAnalyzerPlugin()
  ]
});
