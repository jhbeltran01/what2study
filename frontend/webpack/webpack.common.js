const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve static files
    compress: true, // Enable gzip compression for better performance
    port: 9000, // Port to run the dev server on
    hot: true, // Enable Hot Module Replacement (HMR)
    open: true, // Automatically open the browser
    historyApiFallback: true, // For SPAs, redirects all 404s to index.html
  },
  module: {
    rules: [
      {
        test:/\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "style-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ESLintPlugin({
      // Plugin options
      extensions: ['js', 'jsx'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss',],
    alias: {
      '@root': path.join(__dirname,  '../src'),
      '@modules': path.join(__dirname,  '../src/modules')
    }
  },
};