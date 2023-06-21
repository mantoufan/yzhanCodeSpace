import { computed, reactive, watch } from "vue"

export function createStore(options) {
  // Store 实例
  const store = {
    _state: reactive(options.state() || {}),
    get state() {
      return this._state
    },
    set state(value) {
      throw new Error("do not mutate vuex store state outside mutation handlers.")
    },
    // commit 实现
    _mutations: options.mutations || {},
    // dispatch 实现
    _actions: options.actions || {},
    _commit: false, // 是否已经触发 commit
    _withCommit(fn) { // fn 就是用户设置的 mutation 执行函数
      this._commit = true
      fn()
      this._commit = false
    }
  }

  function commit(type, payload) {
    // 获取 type 对应的 mutation
    const entry = this._mutations[type]
    if (entry === void 0) return console.error(`unknown mutation type: ${type}`)
    // 执行 mutation
    this._withCommit(() => {
      entry.call(this.state, this.state, payload)
    })
  }

  function dispatch(type, payload) {
    // 获取 type 对应的 action
    const entry = this._actions[type]
    if (entry === void 0) return console.error(`unknown action type: ${type}`)
    // 执行 action
    return entry.call(this, this, payload)
  }

  store.commit = commit.bind(store) 
  store.dispatch = dispatch.bind(store) 

  // 定义 store.getters
  store.getters = {}

  // 遍历用户定义 getters
  Object.keys(options.getters).forEach(key => {
    // 定义计算属性
    const result = computed(() => {
      const getter = options.getters[key]
      if (getter === void 0) {
        console.error(`unkonwn getter type: ${key}`)
        return ''
      }
      return getter.call(store, store.state)
    })
    // 动态定义 store.getters.xx, xx 值来自于用户定义的 getters 函数的返回值
    Object.defineProperty(store.getters, key, {
      // 只读
      get() {
        return result
      }
    })
  })

  // strict 模式
  if (options.strict) {
    watch(store.state, () => {
      if (store._commit === false) {
        console.warn('please use commit to mutate state!')
      }
    }, {
      deep: true,
      flush: 'sync'
    })
  }

  // 等同于
  // Object.defineProperty(store, 'state', {
  //   get() {
  //     return this._state
  //   },
  //   set(value) {
  //     throw new Error("do not mutate vuex store state outside mutation handlers.")
  //   }
  // })
  // 插件实现要求的 install 方法
  store.install = function (app) {
    // 注册 $store
    app.config.globalProperties.$store = store
  }
  return store
}