module.exports = base => {
  base.devtool = 'source-map' // 完整 source map
  base.devtool = 'eval' // 最佳性能
  return base
}