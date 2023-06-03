/*
正则
<NumberLiteral> ::= /^(-{0,1}{1-9}{1}{0-9}{0,}|0\.{0-9}{0,})$/
<NulLiteral> ::= /^null$/
<BooleanLiteral> ::= /^(?:true|false)$/
<StringLiteral> ::= /^(?:\"[^\r\n\"]|\\.){0,}\")|(?:\'[^\r\n\']|\\.){0,}\')$/
<LineTerminator> ::= (?:\n)
扩展：<RegExpLiteral>

<Identifier> ::= /^[_&A-Za-z][_&A-Za-z0-9\u200C\u200D]{0,}$/
*/
function regHelp() {
  const reg = /(?<NumberLiteral>(?:0[xX][0-9a-fA-F]*|\.[0-9]+|(?:[1-9]+[0-9]*|0)(?:\.[0-9]*|\.)?)(?:[eE][+-]{0,1}[0-9]+)?(?![_$a-zA-Z0-9]))|(?<NulLiteral>null(?![_$a-zA-Z0-9]))|(?<BooleanLiteral>(?:true|false)(?![_$a-zA-Z0-9]))|(?<StringLiteral>"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"|'(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*')|((?<Punctuator>>>>=|>>=|<<=|===|!==|>>>|<<|%=|\*=|-=|\+=|<=|>=|==|!=|\^=|\|=|\|\||&&|&=|>>|\+\+|--|\:|}|\*|&|\||\^|!|~|-|\+|\?|%|=|>|<|,|;|\.(?![0-9])|\]|\[|\)|\(|{))|(?<Keywords>break(?![_$a-zA-Z0-9])|else(?![_$a-zA-Z0-9])|new(?![_$a-zA-Z0-9])|var(?![_$a-zA-Z0-9])|let(?![_$a-zA-Z0-9])|const(?![_$a-zA-Z0-9])|case(?![_$a-zA-Z0-9])|finally(?![_$a-zA-Z0-9])|return(?![_$a-zA-Z0-9])|void(?![_$a-zA-Z0-9])|catch(?![_$a-zA-Z0-9])|for(?![_$a-zA-Z0-9])|switch(?![_$a-zA-Z0-9])|while(?![_$a-zA-Z0-9])|continue(?![_$a-zA-Z0-9])|function(?![_$a-zA-Z0-9])|this(?![_$a-zA-Z0-9])|with(?![_$a-zA-Z0-9])|default(?![_$a-zA-Z0-9])|if(?![_$a-zA-Z0-9])|throw(?![_$a-zA-Z0-9])|delete(?![_$a-zA-Z0-9])|in(?![_$a-zA-Z0-9])|try(?![_$a-zA-Z0-9])|do(?![_$a-zA-Z0-9])|instanceof(?![_$a-zA-Z0-9])|typeof(?![_$a-zA-Z0-9]))|(?<LineTerminator>(?:\n))|(?<Identifier>[_&A-Za-z][_&A-Za-z0-9\\u200C\\u200D]{0,})/g
  return reg
}

function parseStr(str) {
  const Reg = regHelp()
  const list = []
  while (r = Reg.exec(str)) {
    const groupKeys = Object.keys(r.groups)
    for (const groupKey of groupKeys) {
      if (r.groups[groupKey] === void 0) continue
      list.push({
        type: groupKey === 'Punctuator' || groupKey === 'Keywords' ? r.groups[groupKey] : groupKey,
        value: r.groups[groupKey]
      })
    }
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

对于数学表达式，开头的只能是 Number 或 "("  
对于 JavaScript 表达式，开头可以是 ECMA 206 中 附录 A.2

JavaScript 语义
参与运算的三种类型：
一、运算符优先级
优先级	运算符	描述
1	()	圆括号
2	!	逻辑非
3	*, /, %	乘法、除法、取模
4	+, -	加法、减法
5	<, >, <=, >=, instanceof, in	关系运算符、 instanceof 运算符、 in 运算符
6	==, !=, ===, !==	相等运算符、非相等运算符、严格相等运算符、严格非相等运算符
7	&&	逻辑与
8	||	逻辑或
9	?:	三元条件运算符
10	=, +=, -=, *=, /=, %=, <<=, >>=	赋值运算符、复合赋值运算符、移位运算符等

二、Literal 字面量
String Number Bollean Null undefined Object Symbol BigInt
String: "sdf" 'sdfff' `sdf`
Number: 1e9 0b 二进制 0x 十六进制 0o 八进制
Boolean true false
Null null
undefined 普通变量
{} [] function(){} RegExp
1n 2n

三、变量

Statement：
{}, =
control statement
if for while switch
break continue
try catch finally
yield await
with
return
debugger
var const let
function class

正则
<NumberLiteral> ::= /^(-{0,1}{1-9}{1}{0-9}{0,}|0\.{0-9}{0,})$/
<NulLiteral> ::= /^null$/
<BooleanLiteral> ::= /^(?:true|false)$/
<StringLiteral> ::= /^(?:\"[^\r\n\"]|\\.){0,}\")|(?:\'[^\r\n\']|\\.){0,}\')$/
扩展：<RegExpLiteral>

<Identifier> ::= /^[_&A-Za-z][_&A-Za-z0-9\u200C\u200D]{0,}$/
产生式：
<Literal> ::= <NumberLiteral> | <StringLiteral> | <BooleanLiteral> | <NullLiteral>
<Primary> ::= <Literal> | <Identifier> | "(" <Expression> ")" 
<MemberExpression> ::= <Primary> |
                       <MemberExpression> "." <Identifier> |
                       <MemberExpression> "[" <Expression> "]"
<CallExpression> ::= <MemberExpression> "(" ")" |
                     'new' <NewExpression> "(" ")" |
                     <CallExpression> "(" ")" |
                     <CallExpression> "." <Identifier> |
                     <CallExpression> "[" <Expression> "]"
<NewExpression> ::= <MemberExpression> | "new" <NewExpression> | 
左值
<LeftHandSideExpression> ::= <CallExpression> | <NewExpression>


1. 设计数据结构，存储规则

*/

const getClosure = (symbol, map)  => { // 表示当前的符号
  const rules = []
  const pool = [symbol]
  const visited = new Set()
  while (pool.length !== 0) {
    const current = pool.shift()
    if (map.has(current) === false) continue
    if (visited.has(current) === true) continue
    const ruleBodys = map.get(current)
    ruleBodys.forEach(ruleBody => {
      // if (visited.has(ruleBody[0]) === true) return 
      rules.push({ruleBody, $reduce: current})
      pool.push(ruleBody[0])
    })
    visited.add(current)
  }
  return rules
}

/** 用 states 存储 */
const visited = new Map()
const getClosureState = function(state, map) {
  visited.set(JSON.stringify(state), state)
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const closure = getClosure(key, map)
    closure.forEach(item => {
      const {ruleBody, $reduce: reduce} = item
      let current = state
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
      getClosureState(state[key], map)
    }
  }
  return state
}

// 不带括号的四则运算
function parseExpression(list, map, initialState) {
  visited.clear()
  getClosureState(initialState, map)
  const stack = []
  const stateStack = [ initialState ]
  const n = list.length

  // 同步操作 stack 和 state
  const shift = symbol => {
    while (
      (// console.log(stateStack[stateStack.length - 1], symbol), 
      stateStack[stateStack.length - 1][symbol.type] === void 0) &&
      stateStack[stateStack.length - 1].$reduce
    ) {
      reduce()
    }

    if (stateStack[stateStack.length - 1][symbol.type] === void 0) {
      if (symbol.type === 'EOF' || symbol.type === '}' || hasLineTerminator) {
        shift({
          type: ';',
          value: ';',
        })
        return shift(symbol)
      }
      throw Error('syntax error')
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

  let hasLineTerminator = false
  for (let i = 0; i < n; i++) {
    const symbol = list[i]
    if (symbol.type === 'LineTerminator') {
      hasLineTerminator = true
    } else {
      shift(symbol)
      hasLineTerminator = false
    }
  }
  return stack
}

const evaluator = {
  Program(node) {
    return evaluate(node.children[0])
  },
  StatementList(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    }
    evaluate(node.children[0])
    return evaluate(node.children[1])
  },
  Statement(node) {
    return evaluate(node.children[0])
  },
  ExpressionStatement(node) {
    return evaluate(node.children[0])
  },
  Expression(node) {
    return evaluate(node.children[0])
  },
  AssignmentExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    }
  },
  AdditiveExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      const left = evaluate(node.children[0])
      const right = evaluate(node.children[2])
      if (node.children[1] === '+') {
        return left + right
      } else {
        return left - right
      }
    }
  },
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      const left = evaluate(node.children[0])
      const right = evaluate(node.children[2])
      if (node.children[1] === '+') {
        return left * right
      } else if (node.children[1] === '/') {
        return left / right
      } else {
        return left % right
      }
    }
  },
  LeftHandSideExpression(node) {
    return evaluate(node.children[0])
  },
  MemberExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else if (node.children.length === 3) {

    } else {

    }
  },
  PrimaryExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      return evaluate(node.children[1])
    }
  },
  Literal(node) {
    return evaluate(node.children[0])
  },
  NumberLiteral(node) {
    return eval(node.value)
  }
}

const evaluate = ast => {
  return evaluator[ast.type][ast]
}

exports.regHelp = regHelp
exports.parse = parse
exports.parseStr = parseStr
exports.getClosure = getClosure
exports.getClosureState = getClosureState
exports.parseExpression = parseExpression
exports.evaluate = evaluate