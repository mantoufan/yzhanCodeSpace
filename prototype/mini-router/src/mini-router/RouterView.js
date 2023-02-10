import { defineComponent, getCurrentInstance, h, unref } from "vue";
// 需要更灵活的方式渲染
export default defineComponent({
  setup() {
    return () => {
      // 获取组件实例 ctx 纯对象，proxy 响应式对象
      const { proxy: { $router } } = getCurrentInstance()
      // const { proxy: { $router } } = getCurrentInstance()
      // 1. 获取想要渲染的组件
      // 1.1 获取配置 routes
      // 1.2 通过 current 地址找到匹配的项

      
      let component
      // 路由表
      const route = $router.options.routes.find(route => route.path === unref($router.current))
      if (route) {
        return h(route.component)
      } else {
        console.warn('no match component')
        return ('div', '')
      }
    }
  }
})