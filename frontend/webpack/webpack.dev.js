const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import MiniCssExtractPlugin

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist', 
    hot: true,
  },
  plugins: [
    new MiniCssExtractPlugin({ // Add MiniCssExtractPlugin to plugins array
      filename: '[name].[contenthash].css', // Dynamic filenames for CSS files
    }),
  ],
});