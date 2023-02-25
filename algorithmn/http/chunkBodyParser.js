
module.exports = class ChunkBodyParser{
  constructor() {
    let lengthHexStr = '', length = 0, body = ''
    const readLength = (char) => {
      if (char === '\r') return beforeLineBreak
      lengthHexStr += char
      return readLength
    }
    const beforeLineBreak = char => {
      if (char === '\n') {
        length = parseInt(lengthHexStr, 16)
        return readChunkState
      }
    }
    const readChunkState = char => {
      length--
      body += char
      if (length >= 0) return readChunkState
      return readLength
    }
    this.currentState = readLength
    this.wirte = str => {
      for (const char of str) {
        this.currentState = this.currentState(char)
      }
    }
    this.getBody = () => body
  }
} 