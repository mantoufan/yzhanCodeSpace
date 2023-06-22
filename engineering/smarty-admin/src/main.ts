// import { add } from '~/add'
// const s: string = 'Hello TypeScript';
// console.log(s + add(3, 3));
// document.querySelector('#app')!.innerHTML = 'Hello TypeScript';

// import { createApp, h } from "vue"
import { createRouter, createWebHistory } from "vue-router"
// import { createPinia } from 'pinia'
import App from './App.vue'
// const App = {
//   render() {
//     // <div>Hello TypeScript</div>
//     return h('div', null, [
//       'Hello Vue',
//     ])
//   }
// }

import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
// import routes from '~pages'
const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes
})

import 'uno.css'
import 'nprogress/nprogress.css'

const app = createApp(App)
app.use(router)

// 自动加载
const imports = import.meta.glob('./modules/*.ts')
for (const path in imports) {
  const module = await imports[path]()
  module.install?.({ app, router, isClient: true })
}

app.mount('#app')