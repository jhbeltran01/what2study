const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');


module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },
  devServer: {
    port: 8080,
    writeToDisk: true,
    proxy: {
        '/': 'http://localhost:8080'
    }
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