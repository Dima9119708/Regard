const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
  mode: 'development',
  entry: {
    main : './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename : 'index.html',
      template : './src/pug/index.pug'
    }),
    new HtmlWebpackPlugin({
      filename : 'products.html',
      template : './src/pug/products.pug'
    }),
    new HtmlWebpackPlugin({
      filename : 'basket.html',
      template : './src/pug/basket.pug'
    }),
    new HtmlWebpackPlugin({
      filename : 'product.html',
      template : './src/pug/product.pug'
    }),
    new CopyPlugin([
      {
        from: './src/images',
        to: 'images'
      },
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
  ],
  devtool: isDev ? 'source-map' : false,
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.pug$/i,
        use: ['pug-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: ['file-loader']
      },

    ],
  },
};