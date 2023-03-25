const { parse, getClosure, getClosureState, expressionParseWithoutBracket } = require('../expression')

describe('Test LR Parser', () => {
  test('(1+(2*3))', () => {
    expect(parse('(1+(2*3))')[0]).toEqual({"children": [{"type": "Number", "value": "1"}, {"type": "+", "value": ""}, {"children": [{"type": "Number", "value": "2"}, {"type": "*", "value": ""}, {"type": "Number", "value": "3"}], "type": ""}], "type": ""})
  })
})

describe('Test closure', () => {
  test('Expression', () => {
    const result = getClosure('Expression')
    expect(JSON.stringify(result)).toBe(JSON.stringify(
      [{"ruleBody":["Additive"],"$reduce":"Expression"},{"ruleBody":["Additive"],"$reduce":"Additive"},{"ruleBody":["Multiplicative"],"$reduce":"Additive"},{"ruleBody":["Additive","+","Multiplicative"],"$reduce":"Additive"},{"ruleBody":["Additive","-","Multiplicative"],"$reduce":"Additive"},{"ruleBody":["Primary"],"$reduce":"Multiplicative"},{"ruleBody":["Multiplicative","*","Primary"],"$reduce":"Multiplicative"},{"ruleBody":["Multiplicative","/","Primary"],"$reduce":"Multiplicative"},{"ruleBody":["Number"],"$reduce":"Primary"},{"ruleBody":["(","Expression",")"],"$reduce":"Primary"}]
    ))
  })
})

describe('Test closureState', () => {
  test('closureState', () => {
    const initialState = {
      'Additive': {
        '$reduce': 'Expression'
      }
    }
    const result = getClosureState(initialState)
    const states = {
      // 'Additive': 'Expression', // Additive -> Expreesion
      'Primary': {
        '$reduce': 'Multiplicative'
      },
      'Number': {
        '$reduce': 'Primary'
      },
      '(': {
        'Expression': {
          ')': {
            '$reduce': 'Primary'
          }
        }
      },
      'Multiplicative': {
        '$reduce': 'Additive',
        '*': {
          'Primary': {
            '$reduce': 'Multiplicative'
          }
        },
        '/': {
          'Primary': {
            '$reduce': 'Multiplicative'
          }
        },
      },
      'Additive': {
        '$reduce': 'Expression',
        '+': {
          Multiplicative: {
            '$reduce': 'Additive'
          }
        },
        '-': {
          Multiplicative: {
            '$reduce': 'Additive'
          }
        }
      }
    }
    expect(JSON.stringify(result)).toBe(JSON.stringify(states))
  })
})

describe('ExpressionParse Without Bracket', () => {
  const expression = expressionParseWithoutBracket('(1+(2*3))')
  expect(expression).toEqual([])
})