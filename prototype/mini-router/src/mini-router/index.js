// 1. 导入页面组件
import { createRouter } from './router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
// 2. 定义路由：每个路由对应一个组件
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AboutView
  }
]
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  routes
})

export default router
export * as RouterLink from './RouterLink'
export * as RouterView from './RouterView'
