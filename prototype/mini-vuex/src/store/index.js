import { createStore } from '../mini-vuex'

// 创建 Store 实例
const store = createStore({
  strict: true,
  state() {
    return {
      count: 1
    }
  },
  mutations: {
    // state 从何而来
    add(state) {
      state.count++
    }
  },
  getters: {
    doubleCounter(state) {
      return state.count * 2
    }
  },
  actions: {
    add({ commit}) {
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  }
})

export { store }