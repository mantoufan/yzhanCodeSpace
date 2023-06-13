const Module = require('./module2')
const path = require('path')
const fs = require('fs')
module.exports = class {
  constructor({ entry }) {
    
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
}