// runtime-core

import { effect, reactive } from '../reactivitiy'
import { createVNode } from './vnode'

// ------------custom renderer api---------------
export function createRenderer(options) {
  const { 
    createElement: hostCreateElement,
    insert: hostInsert,
    setElementText: hostSetElementText
  } = options
  // render 负责渲染组件内容
  const render = (vnode, container) => {
    // console.log('mount!');
    // 1. 获取宿主
    // const container = options.querySelector(selector)
    // 2. 渲染视图
    // const observed = reactive(rootComponent.data()) // 增加数据代理，可以感知数据变化
    // 3. 为组件定义更新函数
    // const componentUpdateFn = () => {
    //   const el = rootComponent.render.call(observed)
    //   options.setElementText(container, '')
      // 4. 追加到宿主
    //   options.insert(el, container)
    // }
    // 设置激活副作用
    // effect(componentUpdateFn)

    // 初始化执行一次
    // componentUpdateFn()

    // 挂载钩子
    // rootComponent?.mounted.call(observed)
    
    // 如果存在 vnode 则为 mount 或 patch，否则 unmount
    if (vnode) {
      patch(container._vnode || null, vnode, container)
    }

    container._vnode = vnode
  }

  const patch = (n1, n2, container) => {
    // 如果 n2 的 type 为字符串，说明它是原生节点 Element, 否则是组件
    const { type } = n2
    if (typeof type === 'string') {
      // Element
      processElement(n1, n2, container)
    } else {
      // component
      processComponent(n1, n2, container)
    }
  }

  const processComponent = (n1, n2, container) => {
    if (n1 === null) { // 挂载流程，老节点不存在
      // mount
      mountComponent(n2, container)
    } else {
      // patch
    }
  }

  // 挂载做三件事
  // 1. 组件实例化
  // 2. 状态初始化（响应式）
  // 3. 副作用安装
  const mountComponent = (initialVNode, container) => {
    // 1. 创建组件实例：initialVNode 是模具，做出来的组件是实例（不同实例，模板相同，值不同）
    const instance = {
      data: {},
      vnode: initialVNode,
      isMounted: false
    }

    // 2. 初始化组件状态
    const { data: dataOptions } = instance.vnode.type
    //    数据状态的持有者：实例
    instance.data = reactive(dataOptions())

    // 3. 安装渲染函数副作用
    setupRnederEffect(instance, container)
  }

  const setupRnederEffect = (instance, container) => {
    // 声明组件更新函数
    const componentUpdateFn = () => {
      const { render } = instance.vnode.type
      if (instance.isMounted === false) {
        // 创建阶段
        // 执行组件渲染函数获取其 vnode
        // 保存最新的虚拟 DOM，这样下次更新时，可以作为旧的 VNode 进行比较
        const VNode = instance.subtree = render.call(instance.data)
        // 递归 patch 嵌套节点
        patch(null, VNode, container)

        // 生命周期钩子
        instance.vnode.type?.mounted.call(instance.data)

        // 标识符
        instance.isMounted = true
      }else {
        // 更新阶段
        const prevVNode = instance.subtree
        const nextVNode =  render.call(instance.data)
        // 保存下次更新使用
        instance.subtree = nextVNode
        /// 执行 patch 并传入新旧两个 VNode
        patch(prevVNode, nextVNode)
      }
    }
    // 建立更新机制
    effect(componentUpdateFn)
    // 首次执行组件更新函数
    componentUpdateFn()
  }

  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      // 创建阶段
      mountElement(n2, container)
    } else {
      // 更新阶段
      patchElement(n1, n2,)
    }
  }

  const mountElement = (vnode, container) => {
    const el = vnode.el = hostCreateElement(vnode.type)
    // chilren 如果为文本
    if (typeof vnode.children === 'string') {
      hostSetElementText(el, vnode.children)
    } else {
      // 数组需要递归的创建
      vnode.children.forEach(child => patch(null, child, el))
    }
    // 插入元素
    hostInsert(el, container)
  }

  const patchElement = (n1, n2) => {
    // 获取要更新的元素节点
    const el = n2.el = n1.el
    // 更新 type 相同的节点，实际上还要考虑 key
    if (n1.type === n2.type) {
      // 获取双方子元素
      const oldCh = n1.children
      const newCh = n2.children

      // 根据双方子元素情况做不同处理
      if (typeof oldCh === 'string') {
        if (typeof newCh === 'string') {
          if (oldCh !== newCh) {
            hostSetElementText(el, newCh)
          }
        } else {
          // 替换文本为一组子元素
          hostSetElementText(el, '')
          newCh.forEach(childNode => patch(null, childNode, el))
        }
      } else {

      }
    }
  }

  // 返回一个渲染器实例
  return {
    render,
    // 提供给用户一个 createApp 方法，将 render 方法传入，支持跨平台
    createApp: createAppAPI(render)
  }
}

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      mount(container) {
        // 创建根组件 VNode
        const vnode = createVNode(rootComponent)
        // 传入根组件 VNode 而非根组件配置，render 作用
        // 是将虚拟 DOM 转换为真实 dom 并追加到宿主
        render(vnode, container)
      }
    }
    return app
  } 
}