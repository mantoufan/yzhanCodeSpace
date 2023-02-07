import { createApp } from './mini-vue'
import { createVNode } from './mini-vue/runtime-core/vnode';
import './style.css'
// import App from './App.vue'

createApp({
  data() {
    return {
      title: ['hello', 'mini-vue!']
    };
  },
  render() {
    // const h3 = document.createElement('h3')
    // h3.textContent = this.title
    // return h3
    // 返回 VNode
    if (Array.isArray(this.title)) {
      return createVNode(
        'h3', 
        {}, 
        this.title.map(t => createVNode('p', {}, t))
      )
    } else {
      return createVNode('h3', {}, this.title)
    }
  },
  mounted() {
    setTimeout(() => {
      this.title = ['wow', 'data change!', 'lala']
    }, 2000)
  }
}).mount('#app')
