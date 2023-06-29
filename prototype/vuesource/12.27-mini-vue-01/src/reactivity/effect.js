export let activeEffect = null
export const effectStack = []
export function effect(fn, options = {}) {
  const effectFn = () => {
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    if (effectStack.length) activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.options = options
  effectFn()
}

const targetMap = new WeakMap()

export function track(target, property) {
  if (activeEffect === null) return
  let depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(property)
  if (deps === void 0) deps = new Set()
  depsMap.set(property, deps)
  deps.add(activeEffect)
}

export function trigger(target, property) {
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) return
  const deps = depsMap.get(property)
  if (deps === void 0) return
  deps.forEach(dep => dep.options.scheduler ? dep.options.scheduler(dep) : dep())
}