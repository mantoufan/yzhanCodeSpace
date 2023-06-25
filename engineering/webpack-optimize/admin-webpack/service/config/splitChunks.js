const path = require('path')
module.exports = base => {
  base.entry = {
    index: {
      import: path.resolve(__dirname, '../../src/main.ts'),
      runtime: 'solid-runtime'
    }
  }
  base.output.filename = '[name][chunkhash:8].js'
  base.optimization = {
    splitChunks: {
      chunks: 'all',
      minSize: 500 * 1000,
      maxSize: 2000 * 1000,
      maxAsyncSize: 2000 * 1000,
      minRemainingSize: 100 * 1000,
      minChunks: 1,
      maxAsyncRequests: 2,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000
    }
  }
  return base
}