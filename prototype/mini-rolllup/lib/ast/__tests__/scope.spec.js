const Scope = require('../scope')
describe('测试 Scope', () => {
  it('简单父子关系', () => {
    /**
     * // 示例：
     * cosnt a = 1 // 父作用域
     * function f() { // 子作用域
     *   const b = 2 // 子作用域下的变量
     * }
     */
    const root = new Scope({}) // 父作用域
    root.add('a') // 父作用域下的变量
    const child = new Scope({ // 子作用域，它的父作用域是 root
      parent: root
    })
    child.add('b') // 子作用域下的变量

    // 查找当前作用域的变量
    expect(child.contains('b')).toBeTruthy() 
    expect(child.findDefiningScope('b')).toBe(child)

    // 根据原型链：查找父作用域的变量
    expect(child.contains('a')).toBeTruthy() 
    expect(child.findDefiningScope('a')).toBe(root)
  })
})