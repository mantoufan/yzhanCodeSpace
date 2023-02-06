const analyse = require('../analyse')
const getCode = require('../../../utils/getcode')
describe('_scope _defines', () => {
  it('单语句', () => {
    const { ast, magicString } = getCode('const a = 1')
    analyse(ast, magicString)
    ast._scope // 全局作用域
    expect(ast._scope.contains('a')).toBe(true)
    expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope)
    expect(ast.body[0]._defines).toEqual({ a: true })
  })
})
describe('_dependsOn', () => {
  it('单语句', () => {
    const { ast, magicString } = getCode('const a = 1')
    analyse(ast, magicString)
    expect(ast.body[0]._dependsOn).toEqual({ a: true })
  })

  it('多语句', () => {
    const { ast, magicString } = getCode(`const a = 1;function f() { const b = 2 }`)
    analyse(ast, magicString)
    expect(ast.body[0]._dependsOn).toEqual({ a: true })
    expect(ast.body[1]._dependsOn).toEqual({ f: true, b: true })
  })
})