
const start = {
  AdditiveExpression: {
    EOF: { $end: true },
    '+': {
      MultiplicativeExpression: {
        $reduce: 'AdditiveExpression'
      }
    }
  },
  MultiplicativeExpression: {
    '*': {
      MultiplicativeExpression: {
        $reduce: 'AdditiveExpression'
      }
    }
  },
  PrimaryExpression: {
    $reduce: 'MultiplicativeExpression'
  },
  '(': {
    AdditiveExpression: {
      ')': {
        $reduce: 'PrimaryExpression'
      }
    }
  },
  Number: {
    $reduce: 'primaryExpression'
  }
}
const start1 = {
  AdditiveExpression: {
    EOF: { $end: true }
  }
}
const rules = [
  [
    'AdditiveExpression', [
      ['MultiplicativeExpression'], 
      ['AdditiveExpression', '+', 'MultiplicativeExpression'], 
      ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ]
  ],
  [
    'MultiplicativeExpression', [
      ['PrimaryExpression'],
      [
        'MultiplicativeExpression',
        '*',
        'PrimaryExpression'
      ]
    ]
  ],
  [
    'MultiplicativeExpression', [
      ['PrimaryExpression'],
      [
        'MultiplicativeExpression',
        '*',
        'PrimaryExpression'
      ]
    ]
  ],
  [
    'PrimaryExpression', [
      ['(', 'AdditiveExpression', ')'],
      ['Number']
    ]
  ]
]

const ruleMap = new Map(rules)

const run = state => {
  const visited = new Set()
  const queue = [...Object.keys(state)]
  while (queue.length !== 0) {
    const symbol = queue.shift()
    if (visited.has(symbol)) continue
    visited.add(symbol)
    const current = ruleMap.get(symbol)
    if (current === void 0) continue
    for (const ruleBody of current) {
      let prev = state
      queue.push(ruleBody[0])
      for (const part of ruleBody) {
        if (prev[part] === void 0) prev[part] = {}
        prev = prev[part]
      }
      prev.$reduce = symbol
    }
  }
  return state
}

console.log(JSON.stringify(run(start1), null, 2))

const visited = new Map()
const getClosureState = function(state, rulesMap) {
  visited.set(stringify(state), state)
  for (const symbol of Object.keys(state)) {
    if (symbol.startsWith('$')) continue
    const closure = getClosure(symbol, rulesMap)
    closure.forEach(item => {
      const {ruleBody, $reduce: reduce} = item
      let current = state
      ruleBody.forEach(part => {
        if (current[part] === void 0) current[part] = {}
        current = current[part]
      })
      current.$reduce = reduce
      current.$count = ruleBody.length
    })
  }
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const id = stringify(state[key])
    if (visited.has(id)) {
      state[key] = visited.get(id)
    } else {
      getClosureState(state[key], rulesMap)
    }
  }
  return state
}

const getClosure = (symbol, rulesMap)  => {
  const rules = []
  const pool = [symbol]
  const visited = new Set()
  while (pool.length !== 0) {
    const current = pool.shift()
    if (rulesMap.has(current) === false) continue
    if (visited.has(current) === true) continue
    const ruleBodys = rulesMap.get(current)
    ruleBodys.forEach(ruleBody => {
      rules.push({ruleBody, $reduce: current})
      pool.push(ruleBody[0])
    })
    visited.add(current)
  }
  // console.log(rules)
  return rules
}

function stringify(obj, replacer, space) {
  const cache = new Set()
  
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]'
      }
      cache.add(value)
    }
    if (replacer) {
      return replacer(key, value)
    }
    return value
  }, space)
}
getClosureState(start1, ruleMap)