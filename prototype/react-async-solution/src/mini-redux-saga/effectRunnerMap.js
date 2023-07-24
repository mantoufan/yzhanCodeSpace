import  effectTypes from "./effectTypes"
import process from "./process"
import { isPromise } from "./utils"

function runTakeEffect(env, { channel = env.channel, pattern }, cb) {
  const matcher = input => input.type === pattern
  channel.take(cb, matcher)
}

function runPutEffect(env, { action }, cb) {
  const result = env.dispatch(action)
  cb(result)
}

function runCallEffect(env, {fn, args}, cb) {
  const result = fn.apply(null, args)
  if (isPromise(result)) {
    result.then(data => cb(data)).catch(err => cb(err, true))
    return
  }
  cb(result)
}

function runForkEffect(env, {fn, args}, cb) {
  const taskInterator = fn.apply(null, args)
  process(env, taskInterator)
  cb()
}

function runAllEffect(env, { effects }) {
  for (const effect of effects) {
    process(env, effect)
  }
}

export const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect,
  [effectTypes.CALL]: runCallEffect,
  [effectTypes.FORK]: runForkEffect,
  [effectTypes.ALL]: runAllEffect
}