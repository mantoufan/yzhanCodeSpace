let Reg = /([1-9][0-9]{0,}|0\.{0-9}{0,})|(\+)|(\-)|(\*)|(\/)|([(])|([)])/g

exports.parse = function parse(str) {
  let r
  const list = []
  while (r = Reg.exec(str)) {
    list.push({
      type: r[1] ? 'number' : r[0],
      value: r[1] ?? ''
    })
  }
  list.push({
    type: 'EOF'
  })
  const stack = expressionParse(list)
  return stack
}

// 流式处理，处理一个就往外输出
function expressionParse(list) {
  const stack = []
  const n = list.length
  for (let i = 0; i < n; i++) {
    const char = list[i]
    if (char.type === ')') {
      const symbol = {
        type: '',
        children: []
      }
      let child
      while ((child = stack.pop()).type !== '(') {
        symbol.children.unshift(child) // 归约 reduce （合并）
      }
      stack.push(symbol) // 移入 shift （放回去）
    } else {
      stack.push(char)
    }
  }
  return stack
}
// LL 移入、规约：从左到右
// LR 移入从左到右，规约：从右到左 LR(0) 有终止标识

/* Expression 的 closure
   <Expression> := <Additive>
     <Additive> := <Multiplicative> |
                   <Multiplicative> "+" <Additive> |
                   <Multiplicative> "-" <Additive>
<Multiplicative> := <Primary> |
                   <Primary> "*" <Multiplicative> |
                   <Primary> "/" <Multiplicative>
      <Primary> := <Number> |
                   "(" <Expression> ")"
terminal symbol := 终结符 <Number>
non-terminial symbol := 非终结符 "("

对于数学表达式，开头的只能是 Number 或 "("  
对于 JavaScript 表达式，开头可以是 ECMA 206 中 附录 A.2


1. 设计数据结构，存储规则

*/
const map = new Map([
  ['Expression', [['Additive']]],
  ['Additive', [['Additive'], ['Multiplicative'], ['Multiplicative', '+', 'Additive'], ['Multiplicative', '-', 'Additive']]],
  ['Multiplicative', [['Primary'], ['Primary', '*', 'Multiplicative'], ['Primary', '/', 'Multiplicative']]],
  ['Primary', [['Number'], ['(', 'Expression', ')']]]
])

exports.closure = symbol => {
  const rules = []
  const pool = [symbol]
  const visited = new Set()
  while (pool.length !== 0) {
    const current = pool.shift()
    if (map.has(current) === false) continue
    if (visited.has(current) === true) continue
    visited.add(current)
    map.get(current).forEach(newRules => {
      if (visited.has(newRules[0]) === false) rules.push(newRules)
      pool.push(newRules[0])
    })
  }
  return rules
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

