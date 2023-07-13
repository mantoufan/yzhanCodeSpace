const { Buffer } = require('node:buffer')
// const buff = Buffer.alloc(5)
// console.log(buff)
// 00 is 16 进制位 2 ** 4 * 2 表示一个字节

const buffStr = Buffer.from('abc', 'utf16le')
console.log(buffStr)

const typedArray = new Uint8Array(
  buffStr.buffer,
  buffStr.byteOffset,
  buffStr.length)
console.log(typedArray)
console.log(Buffer.from(typedArray))