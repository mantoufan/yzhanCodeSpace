const Module = require('./module2')
const path = require('path')
const fs = require('fs')
const { default: MagicString } = require('magic-string')
module.exports = class {
  constructor({ entry }) {
    this.entryPath = entry.replace(/\.js$/g, '') + '.js' 
    this.statements = []
  }
  /**
   * 加载模块
   * @param {*} importee 引用模块
   * @param {*} importer 引用者
   * @returns 
   */
  fetchModule(importee, importer) {
    let newPath
    if (importer == void 0) { // 主模块
      newPath = importee
    } else {
      if (path.isAbsolute(importee)) newPath = importee
      else newPath = path.resolve(path.dirname(importer), importee)
    }
    return new Module({ 
      code: fs.readFileSync(newPath).toString(),
      path: newPath,
      bundle: this,
    })
  }

  build(path) {
    this.entry = this.fetchModule(this.entryPath, null)
    this.statements = this.entry.expandAllStatement()
    fs.writeFileSync(path, this.generate())
  }

  generate() {
    const magicString = new MagicString.Bundle()
    this.statements.forEach(statement => {
      const source = statement._source
      if (statement.type === 'ExportNamedDeclaration') {
        source.remove(statement.start, statement.declaration.start)
      }
      magicString.addSource({
        content: source.snip(statement.start, statement.end).toString(),
        separator: '\n'
      })
    })
    return magicString.toString()
  }
}