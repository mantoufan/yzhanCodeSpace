const ThreadLoader = require('thread-loader')

ThreadLoader.warmup({
  workers: 2,
  workerParalleJobs: 10
})

module.exports = base => {
  // 替换 loader
  let vueLoader = base.module.rules.find(v => v.test.toString()=== '/\\.vue$/')

  Object.assign(vueLoader, {
    use: ['thread-loader', 'vue-loader']
  })

  return base
}