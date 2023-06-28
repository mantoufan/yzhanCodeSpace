const getCode = require('../../utils/getcode')
const analyse = require('./analyse')
const has = require('../../utils/has')
const { SYSTEM_VARS } = require('../../consts/system')
class Module {
  constructor({ code, path, bundle }) {
    const { ast, magicString } = getCode(code)
    this.ast = ast
    this.magicString = magicString
    this.path = path
    this.bundle = bundle
    this.analyse()
  }
  analyse() {
    this.imports = Object.create(null)
    this.exports = Object.create(null)
    this.definitions = Object.create(null)
    analyse(this.ast, this.magicString, this)

    this.ast.body.forEach(node => {
      if (node._defines !== void 0) {
        Object.keys(node._defines).forEach(name => this.definitions[name] = node)
      }
      if (node.type === 'ImportDeclaration') {
        const source = node.source.value
        node.specifiers.forEach(specifier => {
          const localName = specifier.local.name
          const name = specifier.imported?.name || ''
          this.imports[localName] = {
            localName,
            name,
            source
          }
        })
      } else if (/^Export/.test(node.type)) {
        const declaration = node.declaration
        if (declaration.type === 'VariableDeclaration') {
          if (declaration.declarations === null) return
          const localName = declaration.declarations[0].id.name 
          this.exports[localName] = {
            localName,
            node,
            expression: declaration
          }
        }
      }
    })
  }

  expandAllStatement() {
    const allStatements = []
    this.ast.body.forEach(statement => {
      // 忽略 import && declaration
      if (statement.type === 'ImportDeclaration') return
      if (statement.type === 'VariableDeclaration') return
      const statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }

  /**
   * 扩展单个语句：声明 + 调用
   * @param {*} statement 
   */
  expandStatement(statement) {
    // 此语句已经被引用
    statement._included = true

    const result = []
    const dependencies = Object.keys(statement._dependsOn)
    dependencies.forEach(name => {
      const definitions = this.define(name)
      result.push(...definitions)
    })
    // 添加自己
    result.push(statement)
    return result
  }

  /**
   * 查找变量声明
   * @param {*} name 变量名
   */
  define(name) {
    // import 模块化
    if (has(this.imports, name)) {
      // 加载模块
      const importDeclaration = this.imports[name]
      const source = importDeclaration.source
      const module = this.bundle.fetchModule(source, this.path)
      const exportData = module.exports[importDeclaration.localName]
      return module.define(exportData.localName)
    } else {
      // 本模块
      const statement = this.definitions[name]
      if (statement) { // 能找到
        if (statement._included) { // 如果其它语句已经放置了该引用，则跳过
          return []
        }
        return this.expandStatement(statement) // 递归，继续找 a 依赖的 b 的定义 const a = b + 1
      } else if (SYSTEM_VARS.includes(name)) { // 系统变量
        return []
      } else {
        throw new Error(`没有此变量: ${name}`)
      }
    }
  }
}

module.exports = Module