module.exports = isValid = ar => {
  const n = ar.length
  const map = new Map([[')', '('], [']', '['], ['}', '{']])
  const stack = []
  for (let i = 0; i < n; i++) {
    const char = ar[i]
    if (map.has(char)) {
      // case1 char in map: ) } ]
      // () [] {}
      // ) -> ( ] -> [ } -> {
      if (stack.pop() !== map.get(char)) return false
    } else {
      // case2 char out map: ( { [
      stack.push(char) // 入栈
    }
  }
  // case3: 遍历结束 
  // 有开始没有结束 { // invalid 
  return stack.length === 0
}

// (1 + (2 * 3))