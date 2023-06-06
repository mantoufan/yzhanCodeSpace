const getVars = require('../ast')


describe('获取代码中的变量名', () => {
    it('单条语句', () => {
        const vars = getVars(`
const a = 1
        `)
        expect(vars).toEqual(['a'])
    })
    it('多条语句', () => {
        const vars = getVars(`
const a = 1
const b = 2
        `)
        expect(vars).toEqual(['a', 'b'])
    })
    it('关键词 var 和 let 不同声明的语句', () => {
        const vars = getVars(`
var a = 1
let b = 2
        `)
        expect(vars).toEqual(['a', 'b'])
    })
})