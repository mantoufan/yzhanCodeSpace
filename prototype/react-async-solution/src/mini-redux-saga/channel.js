import { MATCH } from "./symbol"

export function stdChannel() {
  const currentTasker = []
  return {
    take: (cb, matcher) => {
      cb[MATCH] = matcher
      currentTasker.push(cb)
    },
    put: (action) => {
      const takers = currentTasker
      const n = takers.length
      for (let i = 0; i < n; i++) {
        const taker = takers[i]
        if (taker[MATCH](action)) taker(action)
      }
    },
  }
}