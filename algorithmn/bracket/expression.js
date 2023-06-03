let Reg = /([1-9][0-9]{0,}|0\.{0-9}{0,})|(\+)|(\-)|(\*)|(\/)|([(])|([)])/g

function parseStr(str) {
  let r
  const list = []
  while (r = Reg.exec(str)) {
    list.push({
      type: r[1] ? 'Number' : r[0],
      value: r[1] ?? ''
    })
  }
  list.push({
    type: 'EOF'
  })
  return list
}

function parse(str) {
  return expressionParse(parseStr(str))
}

// 流式处理，处理一个就往外输出
// 一定带括号的四则运算
function expressionParse(list) {
  const stack = []
  const n = list.length
  
  const shift = symbol => {
    stack.push(symbol)
  }

  const reduce = () => {
    const symbol = {
      type: '',
      children: []
    }
    let child
    while ((child = stack.pop()).type !== '(') {
      symbol.children.unshift(child) // 归约 reduce （合并）
    }
    stack.push(symbol) // 移入 shift （放回去）
  }

  for (let i = 0; i < n; i++) {
    const char = list[i]
    if (char.type === ')') { // reduce 遇到 ）
      reduce()
    } else { // shift 其它的都 push 到栈里面
      shift(char)
    }
  }
  return stack
}
// LL 移入、规约：从左到右
// LR 移入从左到右，规约：从右到左 LR(0) 有终止标识

/* Expression 的 closure
   <Expression> := <Additive>
     <Additive> := <Multiplicative> |
                   <Additive> "+" <Multiplicative> |
                   <Additive> "-" <Multiplicative>
<Multiplicative> := <Primary> |
                   <Multiplicative> "*" <Primary> |
                   <Multiplicative> "/" <Primary>
      <Primary> := <Number> |
                   "(" <Expression> ")"
terminal symbol := 终结符 <Number>
non-terminial symbol := 非终结符 "("

1. 设计数据结构，存储规则

*/
const map = new Map([
  ['Expression', [['Additive']]],
  ['Additive', [['Multiplicative'], ['Additive', '+', 'Multiplicative'], ['Additive', '-', 'Multiplicative']]],
  ['Multiplicative', [['Primary'], ['Multiplicative', '*', 'Primary'], ['Multiplicative', '/', 'Primary']]],
  ['Primary', [['Number'], ['(', 'Expression', ')']]]
])

const getClosure = symbol => { // 表示当前的符号
  const rules = []
  const pool = [symbol]
  const visited = new Set()
  while (pool.length !== 0) {
    const current = pool.shift()
    if (map.has(current) === false) continue
    if (visited.has(current) === true) continue
    const ruleBodys = map.get(current)
    ruleBodys.forEach(ruleBody => {
      if (visited.has(ruleBody[0]) === true) return 
      rules.push({ruleBody, $reduce: current})
      pool.push(ruleBody[0])
    })
    visited.add(current)
  }
  return rules
}

/** 用 states 存储 */
const visited = new Map()
const getClosureState = function(state) {
  visited.set(JSON.stringify(state), state)
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const closure = getClosure(key)
    closure.forEach(item => {
      const {ruleBody, $reduce: reduce} = item
      current = state
      ruleBody.forEach(symbol => {
        if (current[symbol] === void 0) current[symbol] = {}
        current = current[symbol]
      })
      current.$reduce = reduce
      current.$count = ruleBody.length
    })
  }
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const id = JSON.stringify(state[key])
    if (visited.has(id)) {
      state[key] = visited.get(id)
    } else {
      getClosureState(state[key])
    }
  }
  return state
}

const initialState = {
  Expression: {
    EOF: {
      $end: true
    }
  },
  Additive: {
    '$reduce': 'Expression',
    '$count': 1
  }
}

// 不带括号的四则运算
function parseExpression(list) {
  getClosureState(initialState)
  const stack = []
  const stateStack = [ initialState ]
  const n = list.length

  // 同步操作 stack 和 state
  const shift = symbol => {
    while (
      stateStack[stateStack.length - 1][symbol.type] === void 0 &&
      stateStack[stateStack.length - 1].$reduce
    ) {
      reduce()
    }
    stack.push(symbol)
    stateStack.push(stateStack[stateStack.length - 1][symbol.type])
  }

  // 根据 state 操作 stack
  const reduce = () => {
    const currentState = stateStack[stateStack.length - 1]
    const symbol = {
      type: currentState.$reduce,
      children: []
    }
    for (let i = 0; i < currentState.$count; i++) {
      symbol.children.unshift(stack.pop())
      stateStack.pop()
    }
    shift(symbol) // 移入 shift （放回去）
  }

  for (let i = 0; i < n; i++) {
    const symbol = list[i]
    shift(symbol)
  }
  return stack
}

const generateState = symbols => {
  const states = []
  symbols.forEach((nextSymbol, index) => {
    states.push(realSymbol => {
      if (realSymbol.type === nextSymbol) {
        return states[index + 1]
      } 
    })
  })
  return states[0]
}

const start = symbol => {
  if (symbol.type === 'Expression') {

    return 
  }
}

const eof = symbol => {
  if (symbol.type === 'EOF') {

  }
}

const success = () => success

exports.parse = parse
exports.parseStr = parseStr
exports.getClosure = getClosure
exports.getClosureState = getClosureState
exports.parseExpression = parseExpression