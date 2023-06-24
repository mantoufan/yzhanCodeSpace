class Promsie {
  static PENDING = 0
  static FULFILLED = 1
  static REJECTED = 2
  constructor(func) {
    this.status = Promsie.PENDING
    this.resolveCallbacks = []
    this.rejectCallbacks = []
    try {
      func(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }
  resolve(value) {
    queueMicrotask(() => {
        if (this.status === Promsie.PENDING) {
          this.status = Promsie.FULFILLED
          this.value = value
          this.resolveCallbacks.forEach(callback => callback(value))
        }
      })
  }
  reject(reason) {
    queueMicrotask(() => {
      if (this.status === Promsie.PENDING) {
        this.status = Promsie.REJECTED
        this.reason = reason
        this.rejectCallbacks.forEach(callback => callback(reason))
      }
    })
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => {}
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
    let promise2
    return promise2 = new Promsie((resolve, reject) => {
      if (this.status === Promsie.PENDING) {
        this.resolveCallbacks.push(() => {
          const result = onFulfilled(this.value)
          resolutionProcedure(promise2, result, resolve, reject)
        })
        this.rejectCallbacks.push(() => {
          const reason = onRejected(this.reason)
          reject(reason)
        })
      }
      if (this.status === Promsie.FULFILLED) {
        queueMicrotask(() => {
          const result = onFulfilled(this.value)
          resolutionProcedure(promise2, result, resolve, reject)
        })
      }
      if (this.status === Promsie.REJECTED) {
        queueMicrotask(() => {
          const reason = onRejected(this.reason)
          reject(reason)
        })
      }
    })
  }
}

function resolutionProcedure(promise2, x, resolve, reject) {
  if (x === promise2) return reject(new TypeError('Chaining cycle detected for promise'))
  if (x instanceof Promise) return x.then(result => resolutionProcedure(promise2, result, resolve, reject), reject)
  let called = false
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          result => {
            if (called === true) return
            called = true
            resolutionProcedure(promise2, result, resolve, reject)
          },
          reason => {
            if (called) return
            called = true
            reject(reason)
          }
        )
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called === true) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }

}

console.log('第一步')
const promise = new Promsie((resolve, reject) => {
  console.log('第二步')
  setTimeout(() => {
    resolve('这次一定')
    reject('下次一定')
    console.log('第四步')  
  })
})
promise.then(
  result=>{
    console.log(result)
    return new Promise((resolve)=>{
      resolve('下次一定')
    })
  },
  reason=>{
    console.log(reason)
  }
).then(
  result=>{
    console.log(result)
  },
  reason=>{
    console.log(reason)
  }
)
console.log('第三步')