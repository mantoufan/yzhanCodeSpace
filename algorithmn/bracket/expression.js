let Reg = /([1-9][0-9]{0,}|0\.{0-9}{0,})|(\+)|(\-)|(\*)|(\/)|([(])|([)])/g
module.exports = function parse(str) {
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
        symbol.children.unshift(child) // 规约 reduce （合并）
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