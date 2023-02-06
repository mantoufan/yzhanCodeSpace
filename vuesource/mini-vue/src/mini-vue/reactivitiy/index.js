// 当前活动的副作用
let activeEffect;
export function effect(fn) {
  activeEffect = fn
}
// 接收需要做响应式处理的对象 obj，返回一个代理对象
export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) { // 读取
      // target[key] 
      const value = Reflect.get(target, key)
      // 依赖跟踪
      track(target, key)
      return value
    },
    set(target, key, value) { // 新增 + 更新
      // 为什么不用 target[key] = value，因为操作成功与否，没有返回值，而 Reflect.set 有
      const result = Reflect.set(target, key, value)
      // 依赖触发
      trigger(target, key)
      return result
    },
    deleteProperty(target, key) { // 删除
      const result = Reflect.deleteProperty(target, key)
      // 依赖触发
      trigger(target, key)
      return result
    }
  })
}

// 创建一个 Map 保存依赖关系 {target: {key: [fn1, fn2]}}
const targetMap = new WeakMap()
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    // 首次 depsMap 不存在
    if (depsMap === void 0) targetMap.set(target, depsMap = new Map())

    // 获取 depsMap 中 key 对应 set
    let deps = depsMap.get(key)
    // 手册 deps 不存在
    if (deps === void 0) depsMap.set(key, deps = new Set())

    // 添加当前激活的副作用
    deps.add(activeEffect)
  }
}

// 触发副作用
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) return
  const deps = depsMap.get(key)
  if (deps === void 0) return
  deps.forEach(dep => dep())
}