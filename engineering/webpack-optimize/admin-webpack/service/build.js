let base = require('./config/base')
const cache = require('./config/cache')
const speedMeasure = require('./config/speedMeasure')
const happypack = require('./config/happypack')
const tshappypack = require('./config/tshappypack')
const threadLoader = require('./config/threadloader')
const terser = require('./config/terser')
const lazyCompilation = require('./config/lazyCompilation')
const exclude = require('./config/exclude')
const noParse = require('./config/noParse')
const devOptimization = require('./config/devOptimization')
const evalSourceMap = require('./config/evalSourceMap')
const quickMinify = require('./config/quickMinify')
const swcLoader = require('./config/swcloader')
// 添加缓存
// base = cache(base)
// 添加速度测量
// base = speedMeasure(base)
// 并行：haapypack
// base = happypack(base)
// 并行：tshappypack
// base = tshappypack(base)
// 并行：threadLoader
// base = threadLoader(base)
// 并行：terser
// base = terser(base)
// 懒编译：lazyCompilation
// base = lazyCompilation(base)
// 排除：exclude
// base = exclude(base)
// 排除：noParse
// base = noParse(base)
// 开发：devOptimization
// base = devOptimization(base)
// 开发：evalSourceMap
// base = evalSourceMap(base)
// 压缩：quickMinify
// base = quickMinify(base)
// 高效：swcLoader
base = swcLoader(base)
base.mode = 'production'

module.exports = base