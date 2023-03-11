const { parse, closure } = require('../expression')

describe('Test LR Parser', () => {
  test('(1+(2*3))', () => {
    expect(parse('(1+(2*3))')[0]).toEqual({"children": [{"type": "number", "value": "1"}, {"type": "+", "value": ""}, {"children": [{"type": "number", "value": "2"}, {"type": "*", "value": ""}, {"type": "number", "value": "3"}], "type": ""}], "type": ""})
  })
})

describe('Test closure', () => {
  test('Expression', () => {
    const result = closure('Expression')
    expect(JSON.stringify(result)).toBe(JSON.stringify([["Additive"],["Multiplicative"],["Multiplicative","+","Additive"],["Multiplicative","-","Additive"],["Primary"],["Primary","*","Multiplicative"],["Primary","/","Multiplicative"],["Number"],["(","Expression",")"]]))
  })
})