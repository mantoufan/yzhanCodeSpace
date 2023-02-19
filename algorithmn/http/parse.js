// State Machine
module.exports = function parse(str) {
  // console.log(str)
  let state = start
  for (const char of str.split('').concat(EOF)) {
    // console.log(char)
    state = state(char)
    // if (state = success) return 
  }
  console.log(response)
  return false
}
const start = char => {
  if (char === ' ') return afterHTTP
  return start
}
const afterHTTP = char => {
  if (char === ' ') return afterStatusCode
  response.statusCode += char
  return afterHTTP
}
const afterStatusCode = char => {
  if (char === '\r') return afterStatusText
  response.statusText += char
  return afterStatusCode    
}
const afterStatusText = () => {
  return afterStatusText
}
const success = () => success
const response = {
  statusCode: '',
  statusText: '',
  headers: Object.assign(Object.create(null), {
    'Content-type': 'text/html',
    'Date': 'Sat, 18 Feb 2023 13:32:22 GMT',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=5',
    'Transfer-Encoding': 'chunked'
  }),
  body: `14
  <h1>Hello world</h1>
  0`
} 
const EOF = Symbol('EOF')