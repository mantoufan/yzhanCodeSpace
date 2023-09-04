/* craco.config.js */
const CracoLessPlugin = require('craco-less')
const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  babel: {
    // Used to support decorator
    plugin: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        },
        modifyLessRule: function() {
          return {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
              {loader: 'style-loader'},
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:6]',
                  }
                }
              },
              {loader: 'less-loader'}
            ]
          }
        }
      }
    }
  ],
  devServer: {
    proxy: { // 配置跨域（或代理）
      '/api': { target: 'http://localhost:3000', changeOrigin: true}, 
      '/all': { target: 'http://localhost:3001', changeOrigin: true}
    }
  }
}