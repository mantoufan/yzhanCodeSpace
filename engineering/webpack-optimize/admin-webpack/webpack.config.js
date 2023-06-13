const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 开发环境
  entry: path.resolve(__dirname, './src/main.js'),
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
    // loader
  },
  plugins: [
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
    <h1>Hello Webpack</h1>
    <div id="app"></div>
  </body>
</html>`
    })
  ],
  devServer: {
    port: 8080,
    static: {
      directory: path.join(__dirname, 'public')
    },
  }
}