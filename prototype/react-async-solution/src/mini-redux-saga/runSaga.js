import process from "./process"

export default function runSaga({ channel, getState, dispatch }, saga, ...args) {
  const iterator = saga(...args)
  process({ channel, getState, dispatch }, iterator)
}