const TerserPlugin = require("terser-webpack-plugin")

module.exports = base => {
  base.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            arguments: true,
            dead_code: true,
            drop_console: true,
            drop_debugger: false,
            // 移除 console
            pure_funcs: ['console.log']
          },
          toplevel: false,
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  }
  return base
}