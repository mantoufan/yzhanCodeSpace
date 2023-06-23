module.exports = base => {
  // 替换 loader
  let tsLoader = base.module.rules.find(v => v.test.toString()=== '/\\.tsx?$/')

  Object.assign(tsLoader, {
    use: ['babel-loader', {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/],
        happyPackMode: true
      },
    }]
  })

  return base
}