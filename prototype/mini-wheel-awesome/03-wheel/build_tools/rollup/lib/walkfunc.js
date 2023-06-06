const acorn = require('acorn')
const walk = require('./walk3')


module.exports = code => {
  let ast = acorn.parse(code, {
    locations: true, // 索引位置
    ranges: true,
    sourceType: 'module', // 模块化标准
    ecmaVersion: 7
  })
  let depth = 0, output = ['']
  walk(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration') {
        output.push(' '.repeat(depth << 1) + `====function ${node.id.name}====`)
        depth++
      } else if (node.type === 'VariableDeclaration') {
        output.push(' '.repeat(depth << 1) +  node.declarations.map(declaration => declaration.id.name).join(','))
      }
    },
    leave(node) {
      if (node.type === 'FunctionDeclaration') {
        depth--
        output.push(' '.repeat(depth << 1) + `====function ${node.id.name}====`)
      }
    }
  })
  return output.join("\n")
}
