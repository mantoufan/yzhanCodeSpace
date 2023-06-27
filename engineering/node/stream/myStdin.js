const { stdin, exit } = require("process")

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf-8')
stdin.write(`\x1b[31m╭─────╮
│     │
╰─────╯　`)
stdin.on('data', (chunk) => {
  const char = chunk.split('').map((c) => c.charCodeAt(0))
  if (char.length === 1 && char[0] === 27) {
    exit()
  }
  if (char.length === 3) {
    if (char[0] === 27 && char[1] == 91) {
      if (char[2] === 65) {
        return process.stdout.write('\x1b[1A')
      } else if (char[2] === 66) {
        return process.stdout.write('\x1b[1B')
      } else if (char[2] === 67) {
        return process.stdout.write('\x1b[1C')
      } else if (char[2] === 68) {
        return process.stdout.write('\x1b[1D')
      }
    } 
  }
  process.stdout.write('\x1b[31m\x1b[46m\x1b[5m' + chunk.toString())
  // ESC：[ 27 ]
  // 上：[ 27, 91, 65 ]
  // 下：[ 27, 91, 66 ]
  // 右：[ 27, 91, 67 ]
  // 左：[ 27, 91, 68 ]
  // console.log('output:', char)
})