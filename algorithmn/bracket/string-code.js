const fs = require('fs')
const { Buffer } = require('node:buffer')
function encodeUTF16(str) {
  const bytes = []
  for (const char of str) {
    const codePoint = char.charCodeAt(0)
    if (codePoint < 1 << 16) {
      const low = codePoint & ((1 << 8) - 1) // 取前 8 位
      const high = codePoint >> 8
      bytes.push(low, high)
      console.log(low, high)
    } else {
      const high1 = codePoint >> 18 | 0b11011000
      const low1 = codePoint >> 10 & ((1 << 8) - 1)
      const high2 = codePoint >> 8 & ((1 << 2) - 1) | 0b11011100
      const low2 = codePoint & ((1 << 8) - 1)
      bytes.push(low1, high1, low2, high2)
    }
  }
  console.log(bytes)
  const byteArray = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes[i]
  }
  return byteArray
}
console.log(Buffer.from(fs.readFileSync('./16.txt')))
const res = encodeUTF16('\uFEFF一')
console.log(Buffer.from(res))
fs.writeFileSync('./text.txt', res)