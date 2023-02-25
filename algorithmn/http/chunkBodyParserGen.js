
// function generator
function* generateBody(str) {
  let lengthHexStr = '', length = 0, body = ''

  let state = readLength
  for (const char of str) {
    state = state(char)
    if (body.length > 0) {
      yield body
      body = ''
    }
  }
  function readLength (char) {
    if (char === '\r') return beforeLineBreak
    lengthHexStr += char
    return readLength
  }
  function beforeLineBreak (char) {
    if (char === '\n') {
      length = parseInt(lengthHexStr, 16)
      return readChunkState
    }
    return beforeLineBreak
  }
  function readChunkState (char) {
    length--
    body += char
    if (length >= 0) return readChunkState
    return readLength
  }
}
const str = `1b\r\n<h1>hello world!12345</h1>\r\n0\r\n`
const body = generateBody(str)
for (const char of body) {
  console.log('char', char)
}