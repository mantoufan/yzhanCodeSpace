import { track, trigger } from './effect'

export function reactive(target) {
  return new Proxy(target, {
    get(target, property, receiver) {
      track(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, receiver) {
      const res = Reflect.set(target, property, receiver)
      trigger(target, property)
      return res
    },
    deleteProperty(target, property, receiver) {
      const res = Reflect.deleteProperty(target, property, receiver)
      trigger(target, property)
      return res
    }
  })
}