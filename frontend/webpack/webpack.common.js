const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	entry: {
		main: './src/index.js'
	},
	output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js', // Dynamic filenames for JS files
    clean: true, // Clean the output directory before emit
  },
	module: {
    rules: [
			{
        test: /\.(scss|css)$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]', // Dynamic filenames for images
        },
      },
			{
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
	plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for the main HTML file
      filename: 'index.html', // Output filename for the main HTML file
      chunks: ['main'], // Include only the 'app' chunk
    }),
  ],
	optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    alias: {
      // Define aliases for image paths
      '@images': path.resolve(__dirname, '../src/images'),
    },
  },
};