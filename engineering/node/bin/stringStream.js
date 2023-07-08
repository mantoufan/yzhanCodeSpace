const EventEmitter = require('node:events')
/* Stream 一定要有 write 和 end 方法 */
class StringStream extends EventEmitter {
  constructor(string) {
    super()
    this.data = string
  }
  write() {

  }
  end() {

  }
  on() {
    console.log('on', ...arguments)
  }
  pipe(stream) {
    stream.write(this.data)
  }
}

// const stringStream = new StringStream()
// process.stdin.pipe(stringStream)

const stringStream = new StringStream('Hello World!')
stringStream.pipe(process.stdout)
// process.stdin.pipe(stringStream)