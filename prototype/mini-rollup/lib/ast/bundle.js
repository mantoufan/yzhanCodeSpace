const Module = require('./module')
const path = require('path')
const fs = require('fs')
const { default: MagicString } = require('magic-string')
class Bundle {
  constructor({ entry }) {
    // a.js => a
    this.entryPath = entry.replace(/\.js$/, '') + '.js' // 省略 .js
    this.modules = [] // 初始化数组
  }

  /**
   * 
   * @param {*} importee 被调用者 
   * @param {*} importer 调用者
   * @description main.js import foo.js importee foo.js importer man.js
   */
  fetchModule(importee, importer) {
    let route = null
    if (importer === void 0) {
      // 主模块
      route = importee
    } else {
      // 计算相对于 importer 的路径
      if (path.isAbsolute(importee)) { // 绝对路径
        route =importee
      } else { // 相对路径
        route = path.resolve(
          path.dirname(importer), // 相对于的当前工作目录
          importee.replace(/\.js$/, '') + '.js' // 相对路径
        ) // 返回绝对路径
      }
    }

    if (route) {
      // 读取模块的代码
      const code = fs.readFileSync(route, 'utf-8').toString()
      const module = new Module({ 
        code,
        path: route,
        bundle: this // 上下文
      }) 
      return module
    }
  }
  build(outputFileName) {
    const entryModule = this.fetchModule(this.entryPath)
    this.statements = entryModule.expandAllStatement()
    // 生成代码
    const { code } = this.generate()
    fs.writeFileSync(outputFileName, code, 'utf-8')
  }
  generate() {
    const magicStringBundle = new MagicString.Bundle()
    this.statements.forEach(statement => {
      const source = statement._source.clone()
      // 因为在 export 时 定义了变量，需要 Treeshaking 后，确认变量是否被引用后，再删除
      // export const a = 1 => const a = 1
      if (statement.type === 'ExportNamedDeclaration') {
        // 删除 export
        source.remove(statement.start, statement.declaration.start)
      }
      magicStringBundle.addSource({
        content: source,
        separator: '\n'
      })
    })
    return { code: magicStringBundle.toString() }
  }
}
module.exports = Bundle