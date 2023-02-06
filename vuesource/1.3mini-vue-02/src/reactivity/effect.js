//effect.js
export let activeEffect
const effectStack = []
export function effect(fn, options = {}) {
  // 封装一个effectFn用于扩展功能
  const effectFn = () => {
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.options = options // 增加选项以备trigger时使用
  effectFn()
}

const targetMap = new WeakMap()

export function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)

    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }

    deps.add(activeEffect)
  }
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)

  if (depsMap) {
    const deps = depsMap.get(key)

    // 增加scheduler判断
    deps && deps.forEach(dep => {
      if (dep.options.scheduler) {
        dep.options.scheduler(dep)
      } else {
        dep()
      }
    })
  }
}