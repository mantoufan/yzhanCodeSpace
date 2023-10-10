class TerminalSymbol {
  constructor(o) {
    if (o.groups.num) {
      this.type = 'number'
      this.value = o.groups.num
    } else {
      this.value = this.type = o.groups.operator
    }
    
  }
}
class NonTerminalSymbol {
  constructor(type, children) {
    this.type = type
    this.children = children
  }
}

class EOFSymbol {
  constructor() {
    this.type = 'EOF'
  }
}

const regex = /(?<num>(?:[1-9]\d*|0))|(?<operator>[+\/*-])/g;
const str = '1*2*3'
let cur = null
const stack = []
while (cur = regex.exec(str)) {
  stack.push(new TerminalSymbol(cur))
}
stack.push(new EOFSymbol())

AdditiveExpression(stack)

console.log(JSON.stringify(stack, null, 2))

function AdditiveExpression(stack) {
  if (stack[0].type === 'number' || stack[0].type === '(') {
    MultiplicativeExpression(stack)
    AdditiveExpression(stack)
  } else if (stack[0].type === 'MultiplicativeExpression') {
    const multiplicativeExpression = stack.shift()
    const nonTerminalSymbol = new NonTerminalSymbol('AdditiveExpression', [ multiplicativeExpression ])
    stack.unshift(nonTerminalSymbol)
    AdditiveExpression(stack)
  } else if (stack[0].type === 'AdditiveExpression' && stack[1].type === '+') {
    const additiveExpression = stack.shift()
    const plus = stack.shift()
    MultiplicativeExpression(stack)
    const multiplicativeExpression = stack.shift()
    const nonTerminalSymbol = new NonTerminalSymbol('AdditiveExpression', [ additiveExpression, plus, multiplicativeExpression ])
    stack.unshift(nonTerminalSymbol)
    AdditiveExpression(stack)
  } else if (stack[0].type === 'AdditiveExpression' &&  (stack[1].type === 'EOF' || stack[1].type === ')')) {
    return
  }
}

function MultiplicativeExpression(stack) {
  if (stack[0].type === 'number' && stack[1].type === '*' || stack[0].type === '(') {
    PrimaryExpression(stack)
    MultiplicativeExpression(stack)
  } else if (stack[0].type === 'PrimaryExpression') {
    const primaryExpression = stack.shift()
    const nonTerminalSymbol = new NonTerminalSymbol('MultiplicativeExpression', [ primaryExpression ])
    stack.unshift(nonTerminalSymbol)
    MultiplicativeExpression(stack)
  } else if (stack[0].type === 'MultiplicativeExpression' && stack[1].type === '*') {
    const multiplicativeExpression = stack.shift()
    const multiple = stack.shift()
    PrimaryExpression(stack)
    const primaryExpression = stack.shift()
    const nonTerminalSymbol = new NonTerminalSymbol('MultiplicativeExpression', [ multiplicativeExpression, multiple, primaryExpression ])
    stack.unshift(nonTerminalSymbol)
    MultiplicativeExpression(stack)
  } else if (stack[0].type === 'MultiplicativeExpression' && (stack[1].type === 'EOF' || stack[1].type === ')')) {
    return
  }
}

function PrimaryExpression(stack) {
  if (stack[0].type === 'number') {
    const num = stack.shift() // 移除 
    const nonTerminalSymbol = new NonTerminalSymbol('PrimaryExpression', [ num ])
    stack.unshift(nonTerminalSymbol)
  } else if (stack[0].type === '(') {
    const leftBrace = stack.shift()
    AdditiveExpression(stack)
    const additiveExpression = stack.shift()
    const rightBrace = stack.shift()
    const nonTerminalSymbol = new NonTerminalSymbol('PrimaryExpression', [ leftBrace, additiveExpression, rightBrace ])
    stack.unshift(nonTerminalSymbol)
  } else if (stack[0].type === 'PrimaryExpression' && stack[1].type === 'EOF') {
    return
  }
}