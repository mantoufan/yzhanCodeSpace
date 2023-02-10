// 导入声明的两个组件
import RouterLink from './RouterLink'
import RouterView from './RouterView'
import { ref } from 'vue'
export function createRouter(options) {
  // 创建 router 实例
  const router = {
    options, // 保存配置项
    current: ref(window.location.hash.slice(1) || '/'), // 当前激活路由
    install(app) { // 被调用方式 install.call(this) 
      const router = this
      // 1. 注册两个全局组件
      app.component('RouterLink', RouterLink)
      app.component('RouterView', RouterView)

      // 2. 注册 $router
      app.config.globalProperties.$router = router
    }
  }
  // 监听事件
  window.addEventListener('hashchange', () => {
    // 变化保存到 current 并触发 RouterView 更新
    router.current.value = window.location.hash.slice(1)
    console.log(router.current.value)
  })
  return router
}