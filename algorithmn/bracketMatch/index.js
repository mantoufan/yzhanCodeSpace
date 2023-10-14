// [{()}]
// [{}]
// (){}
const isBracketMatch = str => {
  const n = str.length
  const stack = []
  const map = {
    ')': '(',
    ']': '[',
    '}': '{'
  }
  for (let i = 0; i < n; i++) {
    const char = str[i]
    if (['(', '[', '{'].includes(char)) {
      stack.push(char)
    } else if (stack[stack.length - 1] === map[char]) {
      stack.pop()
    } else {
      return false
    }
  }
  return stack.length === 0
}

module.exports = {
  isBracketMatch
}