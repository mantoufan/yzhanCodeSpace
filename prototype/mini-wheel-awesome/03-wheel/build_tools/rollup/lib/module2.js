const acorn = require('acorn')
const analyse = require('./analyse2')
function getCode(code) {
  const ast = acorn.parse(code, {
    locations: true, // 索引位置
    ranges: true,
    sourceType: "module",
    ecmaVersion: 7,
  })
  return {
    ast,
    // magicString: new MagicString(code)
  }
}
module.exports = class {
  imports = Object.create(null)
  exports = Object.create(null)
  definitions = Object.create(null)
  constructor({ code }) {
    const { ast } = getCode(code)
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
}