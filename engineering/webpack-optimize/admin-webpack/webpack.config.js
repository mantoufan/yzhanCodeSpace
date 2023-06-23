const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  // profile: true,
  mode: 'development', // 开发环境
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json']
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['style-loader','css-loader', 'postcss-loader'] },
      { test: /\.scss$/, use: ['style-loader','css-loader', 'sass-loader', 'postcss-loader'] },
      { test: /\.tsx?$/, 
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: { 
            appendTsSuffixTo: [/\.vue$/]
          },
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[contenthash:8][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Admin Webpack</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`
    })
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true, // 支持 History API
    static: {
      directory: path.join(__dirname, 'public')
    },
  }
}