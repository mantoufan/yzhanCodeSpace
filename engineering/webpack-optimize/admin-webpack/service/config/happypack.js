const HappyPack = require('happypack')
module.exports = base => {
  // 替换 loader
  let cssLoader = base.module.rules.find(v => v.test.toString()=== '/\\.css$/')

  Object.assign(cssLoader, {
    test: /\.css?$/,
    use: 'happypack/loader?id=css'
  })

  base.plugins.push(new HappyPack({
    id: 'css',
    loaders: ['style-loader', 'css-loader', 'postcss-loader']
  }))

  return base
}