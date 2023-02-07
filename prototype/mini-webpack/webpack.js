const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

/**
 * 分析单独模块
 * @param {*} file 
 */
function getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, 'utf-8')
  // console.log('body:', body)
  // TODO 有哪些 import 项
  // 转化 AST 语法树
  // 代码字符串 => 对象 => 对象遍历解析
  // 1. parse
  const ast = parser.parse(body, {
    sourceType: 'module' // ES6 Module
  })
  // console.log(ast)

  // 2. transform: traverse
  // 编译过程
  const deps = Object.create(null) // 依赖图
  traverse(ast, {
    // visitor
    ImportDeclaration({ node }) {
      // 遇到 import 节点时的时候，回调
      // console.log('import', node)
      const dirname = path.dirname(file)
      // 计算绝对路径
      // const absolutePath = path.resolve(dirname, node.source.value)
      // 计算相对于入口文件的路径
      const absolutePath = './' + path.join(dirname, node.source.value)
      // console.log('absolutePath', absolutePath)
      deps[node.source.value] = absolutePath
    }
  })

  // TODO ES6 => ES5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  // 导出模块信息
  const moduleInfo = { file, deps, code }
  return moduleInfo
}

// const moduleInfo = getModuleInfo('./src/index.js')
// console.log('moduleInfo', moduleInfo)

/**
 * 解析模块
 */
function parseModules(file) {
  const entry = getModuleInfo(file)
  const temp = [ entry ]
  const depsGraph = Object.create(null)

  // 将所有依赖模块 moduleInfo 放入数组 temp
  getDeps(temp, entry) 

  // 利用 temp 函数构造依赖图
  temp.forEach(moduleInfo => {
    const { file, deps, code } = moduleInfo
    depsGraph[file] = { deps, code }
  })
  return depsGraph
}


/**
 * 获取依赖
 * @param {*} temp parseModules 定义数组
 * @param {*} deps  
 */
function getDeps(temp, { deps }) {
  Object.keys(deps).forEach(key => {
    const child = getModuleInfo(deps[key])
    temp.push(child)
    getDeps(temp, child) // 递归调用
  })
}

// const content = parseModules('./src/index.js')
// console.log('content', content)

function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file))
  return `(function(graph) {
    function require(file) {
      function absoluteRequire(realPath) {
        return require(graph[file].deps[realPath])
      }
      var exports = Object.create(null)
      ;(function (require, exports, code) {
        eval(code)
      })(absoluteRequire, exports, graph[file].code)
      return exports
    }
    require('${file}')
  })(${depsGraph})`
}

const content = bundle('./src/index.js')
// console.log('content', content)
fs.existsSync('./dist') === false && fs.mkdirSync('./dist')
fs.writeFileSync('./dist/bundle.js', content, 'utf-8')