const { EventEmitter } = require('node:events')
module.exports = class MyStream extends EventEmitter {
  constructor(...args) {
    super(...args)
    this.data = ''
  }
  // on() {
  //   console.log('on', ...arguments)
  // }
  // once() {
  //   console.log('once', ...arguments)
  // }
  // emit() {
  //   console.log('emit', ...arguments)
  // }
  write() {
    console.log('write', ...arguments)
  }
  end() {
    console.log('end', ...arguments)
  }
  pipe() {
    this.on('data', (data) => {
      const canContinue = dest.write(data);
      if (!canContinue) {
        this.pause();
        dest.once('drain', () => {
          this.resume();
        });
      }
    });

    this.on('end', () => {
      dest.end();
    });

    return dest;
  }
}