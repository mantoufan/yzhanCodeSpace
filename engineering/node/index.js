// console.log('Hello World')
const process = require('process')
// 1. 数量：控制光标位置
// A：朝上 B：朝下 D：朝左 C：朝右
// console.log('\033[1Aa')
let b = false
function f() {
  // process.stdout.write('\033[11D' + (b == false ? ' '.repeat(11): 'Hello World'))
  // console.log('\033[11D' + (b == false ? ' '.repeat(11): 'Hello World') + '\033[1A')
  b = !b
}
setInterval(f, 300)
