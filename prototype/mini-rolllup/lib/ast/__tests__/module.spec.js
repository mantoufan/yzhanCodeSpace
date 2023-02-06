const Module = require('../module')

describe('测试 Module', () => {
  describe('构造方法 analyse', () => {
    describe('imports', () => {
      it('单个 import', () => {
        const code = `import { a as aa } from '../module'`
        const module = new Module({ code })
        expect(module.imports).toEqual({
          aa: {
            'localName': 'aa', // 别名，as 之后
            'name': 'a', // 原始名
            'source': '../module' // 路基那个
          }
        })
      })

      it('多个 imports', () => {
        const code = `import { a as aa, b } from '../module'`
        const module = new Module({ code })
        expect(module.imports).toEqual({
          aa: {
            'localName': 'aa', // 别名，as 之后
            'name': 'a', // 原始名
            'source': '../module' // 路基那个
          },
          b: {
            'localName': 'b',
            'name': 'b',
            'source': '../module'
          }
        })
      })
    })
    describe('exports', () => {
      it('单个 export', () => {
        const code = 'export var a = 1'
        const module = new Module({ code })
        expect(module.exports['a'].localName).toBe('a')
        expect(module.exports['a'].node).toBe(module.ast.body[0])
        expect(module.exports['a'].expression).toBe(module.ast.body[0].declaration)
      })
    })
    describe('definitions', () => {
      it('单个变量', () => {
        const code = 'const a = 1'
        const module = new Module({ code })
        expect(module.definitions).toEqual({
          'a': module.ast.body[0]
        })
      })
    })

    describe('ExpandAllStatement', () => {
      it('基础', () => {
        const code = `const a = () => 1
                      const b = () => 2
                      a()`
        const module = new Module({ code })
        const allStatements = module.expandAllStatement()
        expect(allStatements.length).toBe(2)
        expect(module.magicString
                     .snip(allStatements[0].start, allStatements[0].end)
                     .toString()).toBe('const a = () => 1')
        expect(module.magicString
                     .snip(allStatements[1].start, allStatements[1].end)
                     .toString()).toBe('a()')
      })
    })
  })
})