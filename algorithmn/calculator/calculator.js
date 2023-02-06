/** 四则运算 */

/** 
 * <number>数字
 * <addOrMinus> ::= "+" | "-"
 * <multiplicativeOp> ::= "*" | "/"
 * 括号
 * <bracketExpression> ::=
 * <number> |
 * "(" <expression> ")"
 * 
 * ** 幂运算
 * <powerExpression> ::=
 * <bracketExpression>
 * <bracketExpression> "**" <powerExpression>
 * 
 * 乘除
 * <multiplicativeExpression> ::= <bracketExpression> | <multiplicativeExpression> <multiplicativeOp> <bracketExpression>
 * <additiveExpression> ::=
 * <number> | // bracket
 * "(" <expression> ")" // bracket
 * | <multiplicativeExpression> "*" <bracketExpression> // multi
 * | <multiplicativeExpression> "/" <bracketExpression> // multi
 * | <multiplicativeExpression> <???> // addi
 * | <additiveExpression> "+" <multiplicativeExpression> // addi
 * | <additiveExpression> "-" <multiplicativeExpression>
 * 
 * <expression> ::= 
 * <additiveExpression> <EOF> // expression
 * <additiveExpression> "+" <multiplicativeExpression> // addi
 * <additiveExpression> "-" <multiplicativeExpression> // addi
 * <multiplicativeExpression> | // addi
 * <multiplicativeExpression> "*" <bracketExpression> // multi
 * <multiplicativeExpression> "/" <bracketExpression> // multi
 * <bracketExpression> | // multi
 * <number> | // bracket
 * "(" <expression> ")" // bracket
 * 
 * <logicAndExpression> ::= <expression> | <logicAndExpression> "&&" <expression>
 * <logicOrExpression> ::= <logicAndExpression> | <logicOrExpression> "||" <logicAndExpression>
 * 等号：右结合，a = b = c = 1 >>> a = (b = (c = 1))
 * ** 幂运算也是右结合运算符
 * <Assignment> ::= <logicOrExpression> | <logicOrExpression> = <Assignment>
 * 
*/

export function calculate(expression) {
  /** 去除表达式前后空格 */
  const trimedExpression = expression.trim();
  /** 复用之前decimal-regexp的十进制小数reg */
  const numberReg = /^(((0|([1-9][0-9]*))?([\.][0-9]{1,}))|((0|([1-9][0-9]*))[\.]?))$/;
  /** 如果是数字则直接返回值 */
  if (numberReg.test(trimedExpression)) return Number(trimedExpression);
  const itemReg = /((?:(?:(?:0|(?:[1-9][0-9]*))?(?:[\.][0-9]{1,}))|(?:(?:0|(?:[1-9][0-9]*))[\.]?)))|(\*|\/|\-|\+)|(\(|\))/g;
  // 只有乘除的情况
  let r;
  const list = [];
  while (r = itemReg.exec(trimedExpression)) {
    const { 1: number, 2: operator, 3: bracket, index } = r;
    if (number) {
      list.push({
        type: 'number',
        value: Number(number),
      });
    } else if (operator) {
      list.push({
        type: `operator${operator}`,
        value: operator,
      });
    } else if (bracket) {
      list.push({
        type: bracket === '(' ? 'bracketOpen' : 'bracketClose',
        value: bracket,
      });
    }
  }
  list.push({ type: "EOF" });
  expressionParser(list);
  const res = list[0]?.calculate();
  return res;
}

const EXPRESSION_TYPE_ADD = Symbol('additive');
const EXPRESSION_TYPE_MULTI = Symbol('multi');
const EXPRESSION_TYPE_BRACKET = Symbol('bracket');

class Expression {
  /**
   * Creates an instance of Expression.
   * @param {*} type: additive | multi | bracket
   * @memberof Expression
   */
  constructor(type) {
    this.type = type;
  }
  addChildren(children) {
    if (!this.children) this.children = [];
    const arr = Array.isArray(children) ? children : [children];
    this.children.push(...arr);
  }
  calculate() {
    const [first, second, third] = this.children;
    /** 括号表达式 */
    if (this.type === EXPRESSION_TYPE_BRACKET) {
      if (first.type === 'number') return first.value;
      return second?.calculate();
    }
    /** 加减或者乘除 */
    const res1 = first?.calculate?.();
    const res2 = third?.calculate?.();
    if (!second?.type) return res1;
    switch (second?.type) {
      case 'operator+':
        return res1 + res2;
      case 'operator-':
        return res1 - res2;
      case 'operator*':
        return res1 * res2;
      case 'operator/':
        return res1 / res2;
    }
    console.log('calculate escape', this);
  }

  // getExpressionString() {
  //   if (this.children.length === 1) {
  //     const [number] = this.children;
  //     return Number(number.value);
  //   }
  //   const [exp1, op, exp2] = this.children;
  //   const res1 = exp1?.getExpressionString?.() || '';
  //   const res2 = exp2?.getExpressionString?.() || '';
  //   const { type } = op;
  //   const operator = type[type.length - 1] || '';
  //   return `${res1} ${operator} ${res2}`;
  // }
}

// const numberToBracket = (item) => {
//   if (item.type !== 'number') return item;
//   const expression = new Expression(EXPRESSION_TYPE_BRACKET);
//   expression.addChildren([item]);
//   return expression;
// }

const multiOpArray = ['operator*', 'operator/'];
const addOpArray = ['operator+', 'operator-'];
// 括号
/*** 括号
 * <bracketExpression> ::=
 * <number> |
 * "(" <expression> ")"
 */
function bracketExpressionParser(list) {
  const [first] = list;
  if (first.type === 'number') {
    const expression = new Expression(EXPRESSION_TYPE_BRACKET);
    expression.addChildren(first);
    list.splice(0, 1, expression);
  } else if (first.type === 'bracketOpen') {
    const expression = new Expression(EXPRESSION_TYPE_BRACKET);
    expression.addChildren(list.splice(0, 1));
    expressionParser(list);
    // [<expression>, ')', ...]
    expression.addChildren(list.splice(0, 2, expression));
  }
}

// 乘除
/** 
 * <multiplicativeExpression> ::=  
 * <number> | // bracket
 * "(" <expression> ")" // bracket
 * <bracketExpression> <???> // multi
 * | <multiplicativeExpression> "*" <bracketExpression> // multi
 * | <multiplicativeExpression> "/" <bracketExpression> // multi
 * */
function multiplicativeExpressionParser(list) {
  const [first, second] = list;
  if (isStartWithBracket(list)) {
    bracketExpressionParser(list);
    multiplicativeExpressionParser(list);
  } else if (first.type === EXPRESSION_TYPE_MULTI) {
    if (multiOpArray.includes(second.type)) {
      // 第二个符号是乘除，则把前三个包一下
      const expression = new Expression(EXPRESSION_TYPE_MULTI);
      expression.addChildren(list.splice(0, 2));
      bracketExpressionParser(list);
      expression.addChildren(list.splice(0, 1, expression));
      multiplicativeExpressionParser(list);
    }
  } else if (first.type === EXPRESSION_TYPE_BRACKET) {
    const expression = new Expression(EXPRESSION_TYPE_MULTI);
    expression.addChildren(list.splice(0, 1, expression));
    multiplicativeExpressionParser(list);
  }
}

/** 
  * <additiveExpression> ::=
 * <number> | // bracket
 * "(" <expression> ")" // bracket
 * | <multiplicativeExpression> "*" <bracketExpression> // multi
 * | <multiplicativeExpression> "/" <bracketExpression> // multi
 * | <multiplicativeExpression> <???> // addi
 * | <additiveExpression> "+" <multiplicativeExpression> // addi
 * | <additiveExpression> "-" <multiplicativeExpression>
 *  */
function additiveExpressionParser(list) {
  const [first, second] = list;
  if (isStartWithBracket(list)) {
    bracketExpressionParser(list);
    additiveExpressionParser(list);
  } else if (first.type === EXPRESSION_TYPE_MULTI) {
    // const expression = new Expression(EXPRESSION_TYPE_ADD);
    // expression.addChildren(list.splice(0, 1, expression));
    // multi => additive
    if (multiOpArray.includes(second.type)) {
      multiplicativeExpressionParser(list);
      additiveExpressionParser(list);
    } else {
      const expression = new Expression(EXPRESSION_TYPE_ADD);
      expression.addChildren(list.splice(0, 1, expression));
    }
  } else if (first.type === EXPRESSION_TYPE_ADD) {
    if (addOpArray.includes(second.type)) {
      const expression = new Expression(EXPRESSION_TYPE_ADD);
      expression.addChildren(list.splice(0, 2));
      multiplicativeExpressionParser(list);
      expression.addChildren(list.splice(0, 1, expression));
      additiveExpressionParser(list);
    }
  }
}
/** 最初的加载函数 */
/** 
 * <expression> ::= 
 * <additiveExpression> <???> // expression
 * <additiveExpression> "+" <multiplicativeExpression> // addi
 * <additiveExpression> "-" <multiplicativeExpression> // addi
 * <multiplicativeExpression> | // addi
 * <multiplicativeExpression> "*" <bracketExpression> // multi
 * <multiplicativeExpression> "/" <bracketExpression> // multi
 * <bracketExpression> | // multi
 * <number> | // bracket
 * "(" <expression> ")" // bracket
 * */
function isStartWithBracket([first]) {
  return first.type === 'number' || first.type === 'bracketOpen'
}

function expressionParser(list) {
  const [first, second] = list;
  if (isStartWithBracket(list)) {
    bracketExpressionParser(list);
    expressionParser(list);
  } else if (first.type === EXPRESSION_TYPE_ADD) {
    if (addOpArray.includes(second.type)) {
      additiveExpressionParser(list);
      expressionParser(list);
    }
  } else if (first.type === EXPRESSION_TYPE_MULTI) {
    // multi => additive
    if (multiOpArray.includes(second.type)) {
      multiplicativeExpressionParser(list);
      expressionParser(list);
    } else {
      additiveExpressionParser(list);
      expressionParser(list);
    }
  } else if (first.type === EXPRESSION_TYPE_BRACKET) {
    multiplicativeExpressionParser(list);
    expressionParser(list);
  }
}

/** 编译语言术语 */
/** reduce: 归约 */
/** shift: 移入 */
/**
 * LL：从左到右移入(shift)，从左到右归约
 * LL(2): 左移入左归约，检查两项
 */