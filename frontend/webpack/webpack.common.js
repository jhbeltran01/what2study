const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../public/'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
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
    // new ESLintPlugin({
    //   extensions: ['js', 'jsx'],
    // }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    alias: {
      '@root': path.join(__dirname, '../src'),
      '@modules': path.join(__dirname, '../src/modules'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@redux': path.resolve(__dirname, '../src/redux'),
      '@services': path.resolve(__dirname, '../src/services'),
    }
  },
};
