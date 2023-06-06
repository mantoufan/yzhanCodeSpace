const acorn = require('acorn');
const { default: MagicString } = require('magic-string');
const ast = require('./ast');

module.exports = function (code) {
    const ast = acorn.parse(code, {
        locations: true, // 索引位置
        ranges: true,
        sourceType: "module",
        ecmaVersion: 7,
    })

    // analyze
    const declarations = Object.create(null)
    ast.body
       .filter(node => node.type === 'VariableDeclaration')
       .forEach(node => node.declarations.forEach(declaration => declarations[declaration.id.name] = node))

    // expand
    const statements = []
    ast.body
       .filter(node => node.type !== 'VariableDeclaration')
       .forEach(node => statements.push(declarations[node.expression.callee.name], node))

    // output
    const m = new MagicString(code)
    return statements.map(node => m.snip(node.start, node.end).toString()).join('')


    // const m = new MagicString(code)
    // m.snip(node.start, node.end).toString()


}