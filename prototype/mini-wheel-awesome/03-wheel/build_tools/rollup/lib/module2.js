const acorn = require('acorn')
const analyse = require('./analyse2')
const MagicString = require('magic-string')
function getCode(code) {
  const ast = acorn.parse(code, {
    locations: true, // 索引位置
    ranges: true,
    sourceType: "module",
    ecmaVersion: 7,
  })
  return {
    ast,
    magicString: new MagicString(code)
  }
}
module.exports = class {
  imports = Object.create(null)
  exports = Object.create(null)
  definitions = Object.create(null)
  constructor({ code }) {
    const { ast, magicString } = getCode(code)
    this.code = magicString
    analyse(ast)
    ast.body.forEach(statement => {
      if (statement._defines !== void 0) {
        const _defines = Object.keys(statement._defines)
        for (const _define of _defines) {
          this.definitions[_define] = statement
        }
      }
      if (statement.type === 'ImportDeclaration') {
        const specifiers = statement.specifiers
        specifiers.forEach(specifier => {
          const { imported, local } = specifier
          this.imports[local.name] = {
            localName: local.name,
            name: imported.name,
            source: statement.source.value
          }
        })
      } else if (statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration') {
        const declarations = statement.declaration.declarations
        declarations.forEach(declaration => {
          this.exports[declaration.id.name] = {
            localName: declaration.id.name,
            node: statement,
            expression: statement.declaration
          } 
        })
        
      }
    })
    this.ast = ast
  }
  expandAllStatement() {
    const allStatements = []
    this.ast.body.forEach(statement => {
      // 忽略 Import 和 Declaration 语句
      if (statement.type === 'ImportDeclaration' || statement.type === 'VariableDeclaration') return
      // 1. 根据 statement 返回对象的声明部分，并加上 statement 自己
      const statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  expandStatement(statement) {
    const statements = []
    // { a: true, b: true, c: true }
    Object.keys(statement._dependsOn).forEach(name => {
      const defines =  this.define(name)
      statements.push(...defines)
   })
    statements.push(statement)
    return statements
  }
  define(name) {
    const statement = this.definitions[name]
    if (statement._included === true) return []
    statement._included = true
    return [statement]
  }
}