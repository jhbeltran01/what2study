const path = require('path'); // Add this line to import the path module
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, '../public'), // Ensure this is the correct path to your static files
    port: 8081,
    hot: true,
    proxy: [
      {
        context: ['/Homepage'],
        target: 'http://172.23.176.1:8080/',
        changeOrigin: true,
        secure: false
      }
    ]
  },
});
