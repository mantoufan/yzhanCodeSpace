import { createApp } from './mini-vue'
import './style.css'
import App from './App.vue'
import { createVNode } from './mini-vue/runtime-core/vnode'

createApp({
  data() {
    return {
      title: ['Hello', 'mini vue']
    }
  },
  render() {
    if (Array.isArray(this.title)) {
      return createVNode('h3', {}, this.title.map(t => createVNode('p', {}, t)))
    } else {
      return createVNode('h3', {}, this.title)
    }
  },
  mounted() {
    setTimeout(() => {
      this.title = ['wow', 'data change!']
    }, 2000)
  }
}).mount('#app')
