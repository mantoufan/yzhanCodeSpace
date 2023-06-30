const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
// 1. Dependency Analysis
function parseModules(entry) {
  const entryModuleInfo = getModuleInfo(entry)
  const queue = [entryModuleInfo]
  const depsGraph = Object.create(null)
  getDeps(queue, entryModuleInfo)
  queue.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })
  return depsGraph
}

function getDeps(queue, { deps }) {
  Object.keys(deps).forEach(key => {
    const depMoudleAbsolutePath = deps[key]
    const depMoudleInfo = getModuleInfo(depMoudleAbsolutePath)
    queue.push(depMoudleInfo)
    getDeps(queue, depMoudleInfo)
  })
}

function getModuleInfo(file) {
  const body = fs.readFileSync(file, 'utf-8')
  const ast = parser.parse(body, { sourceType: 'module' })
  const deps = Object.create(null)
  traverse(ast, {
    ImportDeclaration({node}) {
      const absolutePath = path.resolve(path.dirname(file), node.source.value)
      deps[node.source.value] = absolutePath
    }
  })
  const { code } = babel.transformFromAst(ast, null, {presets: ['@babel/preset-env']})
  const moduleInfo = {file, deps, code}
  return moduleInfo
}

// 2. Bundle
function bundle(entry) {
  const depsGraph = JSON.stringify(parseModules(entry))
  return `void function (graph) {
    function require(file) {
      function absRequire(path) {
        return require(graph[file].deps[path])
      }
      var exports = {}
      void function (require, exports, code) {
        eval(code)
      }(absRequire, exports, graph[file].code)
      return exports
    }
    
    require('${entry}')
  }(${depsGraph})`
}

function build(entry, output) {
  const content = bundle(entry)
  fs.writeFileSync(output, content)
}

module.exports = {
  bundle,
  build
}