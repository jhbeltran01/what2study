const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import MiniCssExtractPlugin

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({ // Add MiniCssExtractPlugin to plugins array
      filename: '[name].[contenthash].css', // Dynamic filenames for CSS files
    }),
  ],
});