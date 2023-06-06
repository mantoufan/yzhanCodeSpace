const acorn = require('acorn')
module.exports = function getVars(code) {
  let ast = acorn.parse(code, {
    locations: true, // 索引位置
    ranges: true,
    sourceType: 'module', // 模块化标准
    ecmaVersion: 7
  })

  return ast.body.map(item=>item.declarations[0].id.name)
}

