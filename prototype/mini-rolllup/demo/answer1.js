/* 读取文件代码转换为字符串 */
const fs = require('fs')
const code = fs.readFileSync('./chapter1.js').toString()
/* 字符串 -> AST */
const acorn = require('acorn')
const ast = acorn.parse(code, {
  sourceType: 'module',
  ecmaVersion: 7
})
const walk = require('../lib/ast/walk')
// 缩进
let indent = 0
walk(ast, {
  enter(node) {
    if (node.type === 'VariableDeclarator') {
      console.log('%svariable', ' '.repeat(indent << 1), node.id.name)
    }
    if (node.type === 'FunctionDeclaration') {
      console.log('%sfunction', ' '.repeat(indent << 1), node.id.name)
      indent++
    }
  },
  leave(node) {
    if (node.type === 'FunctionDeclaration') {
      indent--
    }
  }
})