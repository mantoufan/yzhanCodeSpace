const ChunkBodyParser = require('./chunkBodyParser')
// State Machine
module.exports = function parse(str) {
  let state = http
  for (const char of str.split('').concat(EOF)) {
    state = state(char)
  }
  console.log(response)
  return false
}
const http = char => {
  if (char === ' ') return afterHTTP
  return http
}
const afterHTTP = char => {
  if (char === ' ') return afterStatusCode
  response.statusCode += char
  return afterHTTP
}
const afterStatusCode = char => {
  if (char === '\r') return beforeLineBreak
  response.statusText += char
  return afterStatusCode    
}
const beforeLineBreak = char => {
  if (char === '\n') return headerKeyState
  return beforeLineBreak
}
let currentHeaderKey = '', currentHeaderValue = ''
const headerKeyState = char => {
  if (char === ' ') return afterHeaderKey
  if (char === '\r') return beforeBody
  if (char !== ':') currentHeaderKey += char // 状态机写全局变量
  return headerKeyState
}
const afterHeaderKey = char => {
  if (char === '\r') {
    response.headers[currentHeaderKey] = currentHeaderValue
    currentHeaderKey = ''
    currentHeaderValue = ''
    return beforeLineBreak
  }
  currentHeaderValue  += char
  return afterHeaderKey
}
let chunkBodyParser = null
const beforeBody = char => {
  if (char === '\n') {
    chunkBodyParser = new ChunkBodyParser()
    return body
  }
  return beforeBody
}
const body = char => {
  if (char === EOF) {
    response.body = chunkBodyParser.getBody()
    return success
  }
  chunkBodyParser.wirte(char)
  return body
}
const success = () => success
const error = () => error
const response = {
  statusCode: '',
  statusText: '',
  headers: Object.create(null),
  body: null
} 
const EOF = Symbol('EOF')