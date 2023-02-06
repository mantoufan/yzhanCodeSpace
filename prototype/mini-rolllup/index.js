/* 读取文件代码转换为字符串 */
const fs = require('fs')
const code = fs.readFileSync('./source.js').toString()
/* 字符串 -> AST */
const acorn = require('acorn')
const ast = acorn.parse(code, {
  sourceType: 'module',
  ecmaVersion: 7
})

// 遍历 => 查找变量声明
const declarations = {}
ast.body
   .filter(node => node.type === 'VariableDeclaration')
   .forEach(node => {
    console.log('声明', node.declarations[0].id.name)
    declarations[node.declarations[0].id.name] = node
   })

// 遍历 => 查找非声明（调用）
// a() => const a = () => 1; a()
const statments = []
ast.body
   .filter(node => node.type !== 'VariableDeclaration')
   .forEach(node => {
    statments.push(declarations[node.expression.callee.name]) // 声明在前
    statments.push(node) // 调用在后
   })

// 导出
const MagicString = require('magic-string')
const magicString = new MagicString(code)
console.log('------------------')
statments.forEach(node => {
  console.log(magicString.snip(node.start, node.end).toString())
})
console.log('------------------')