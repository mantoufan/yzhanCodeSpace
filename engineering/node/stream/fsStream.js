const fs = require('node:fs')
const path = require('node:path')
const readStream = fs.createReadStream(path.resolve(__dirname, './data.txt'))
// readStream.on('data', (chunk) => {
//   console.log(chunk.toString())
// })
// readStream.on('end', (chunk) => {
//   console.log(...arguments)
// })
// const writeStream = fs.createWriteStream('./data2.txt', { encoding: 'utf8' })
// writeStream.write('geek2')
// writeStream.end('end')

// Pipe: 将读流和写流连接起来

// readStream.pipe(fs.createWriteStream('./data3.txt'), { encoding: 'utf8' })
// readStream.pipe(process.stdout)

const MyStream = require('./MyStream.js')
// readStream.pipe(new MyStream())
// process.stdin.pipe(new MyStream())
process.stdin.pipe(process.stdout)