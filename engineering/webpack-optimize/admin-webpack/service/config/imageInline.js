module.exports = base => {
  let loader = base.module.rules.find(rule => rule.test.toString() ==='/\\.(png|jpe?g|gif|svg|webp)(\\?.*)?$/')
  Object.assign(loader, {
    parser: {
      dataUrlCondition: {
        maxSize: 30 * 1024 // 30kb
      }
    },
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
          },
          optipng: {
            enabled: false,
          },
          pngquant: {
            qulaity: [0.65, 0.90],
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          webp: {
            qulaity: 75
          }
        }
      }
    ]
  })
  return base
}