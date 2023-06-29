let activeEffect // 当前活动副作用

export function effect(fn) {
  activeEffect = fn
}

// 接收需要做响应式处理的对象 obj，返回一个响应式对象

export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const value = Reflect.get(target, key)
      track(target, key)
      return value // 能够返回操作结果
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      trigger(target, key)
      return result
    }, // 新增，更新
    deleteProperty(target, key) { // 删除
      const result = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return result
    }
  })
}

// 创建一个数据结构：{target: {key: [fn1, fn2]}
const targetMap = new WeakMap

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    // 首次 depsMap 不存在，需要创建
    if (depsMap === void 0) {
      targetMap.set(target, depsMap = new Map())
    }
    // 获取 depsMap 中 key 对应的值
    let deps = depsMap.get(key)
    // 首次 deps 不存在，需要创建
    if (deps === void 0) {
      depsMap.set(key, deps = new Set)
    } 
    // 添加当前激活的副作用
    deps.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (depsMap) {
    const deps = depsMap.get(key)
    if (deps) {
      deps.forEach(dep => dep())
    }
  }
}