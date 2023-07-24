import { effectRunnerMap } from "./effectRunnerMap"
import { IO } from "./symbol"

export default function process(env, iterator) {
  next()

  function next(arg, isErr) {
    let result
    if (isErr) result = iterator.throw(arg)
    else result = iterator.next(arg)
    if (result.done === false) {
      digestEffect(result.value, next)
    }
  }

  function digestEffect(effect, cb) {
    let effectSettled

    function currentCb(res, isErr) {
      if (effectSettled) return 
      effectSettled = true
      cb(res, isErr)
    }

    function runEffect(effect, currentCb) {
      if (effect && effect[IO]) {
        const effectRunner = effectRunnerMap[effect.type]
        effectRunner(env, effect.payload, currentCb)
      } else {
        currentCb()
      }
    }
    runEffect(effect, currentCb)
  }
}

