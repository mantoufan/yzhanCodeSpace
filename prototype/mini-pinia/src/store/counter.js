import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state() {
    return {
      count: 1
    }
  },
  getters: {
    doubleCounter(state) {
      console.log(state)
      return state.count * 2
    }
  },
  actions: {
    increment() {
      console.log(this)
      this.count++
    }
  }
})