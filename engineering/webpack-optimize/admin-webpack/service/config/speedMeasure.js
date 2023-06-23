const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const speedMeasurePlugin = new SpeedMeasurePlugin()

// 注意，这里用 `speedMeasurePlugin.wrap` 函数包裹 Webpack 配置
module.exports = base => {
  let loader = base.plugins[0]
  base.plugins.shift()
  base = speedMeasurePlugin.wrap(base)
  base.plugins.unshift(loader)
  return base
}