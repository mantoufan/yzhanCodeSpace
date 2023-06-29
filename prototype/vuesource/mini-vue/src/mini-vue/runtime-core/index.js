
import { effect, reactive } from '../reactivity'
import { createVNode, sameVnode } from './vnode'
// runtime-core
// ------ custom renderer api -------
export function createRenderer(options) {
  const  { 
    setElementText: hostSetElementText,
    createElement: hostCreateElement,
    insert: hostInsert,
    remove: hostRemove
  } = options
  // render 负责渲染内容
  const render = (vnode, container) => {
    // 如果存在 vnode 则为 mmount 或 patch，否则 unmount
    if (vnode) {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  const patch = (n1, n2, container, anchor = null) => {
    // 如果 n2 中的 type 为字符串，说明当前节点是原生节点 element，否则是组件
    const { type } = n2
    if (typeof type === 'string') {
      // element
      processElement(n1, n2, container)
    } else {
      // component
      processComponent(n1, n2, container)
    }
  }

  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      // mount
      mountComponent(n2, container)
    } else {
      // patch

    }
  }

  // 挂载做三件事：
  // 1. 组件实例化
  // 2. 状态初始化
  // 3. 副作用安装
  const mountComponent = (initialVNode, container) => {
    // 创建组件实例
    const instance = {
      data: {},
      vnode: initialVNode,
      isMounted: false
    }

    // 初始化组件状态
    const { data: dataOptions } = instance.vnode.type
    instance.data = reactive(dataOptions())

    // 安装渲染函数的副作用
    setRenderEffect(instance, container)
  }

  const setRenderEffect = (instance, container) => {
    // 声明组件更新函数
    const componentUpdateFn = () => {
      const { render } = instance.vnode.type
      if (instance.isMounted === false) {
        // 创建阶段
        // 执行组件渲染函数获取 vnode
        // 保存最新的虚拟 DOM，这样下次更新时，可以作为旧的 VNode 进行比较
        const vnode = instance.substree = render.call(instance.data)
        // 递归 patch 嵌套节点
        patch(null, vnode, container)

        // 挂载钩子
        if (instance.vnode.type.mounted) {
          instance.vnode.type.mounted.call(instance.data)
        }
        // 设置标识符为 True
        instance.isMounted = true
      } else {
        // 更新阶段
        const prevVNode = instance.substree
        // 获取最新的 VNode
        const nextVNode = render.call(instance.data)
        instance.substree = nextVNode
        // 执行 patch 传入新旧 VNode
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
      patchElement(n1, n2)
    }
  }
  
  const mountElement = (vnode, container) => {
    const el = vnode.el = hostCreateElement(vnode.type)
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else {
      // 数组需要递归黄健
      vnode.children.forEach(child => patch(null, child, el))
    }
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

      // 根据双方子元素的情况做不同处理
      if (typeof oldCh === 'string') {
        if (typeof newCh === 'string') {
          // 对比双方文本，如果变化则更新
          if (oldCh !== newCh) {
            hostSetElementText(el, newCh)
          }
        } else {
          // 替换文本为一组子元素
          hostSetElementText(el, '')
          newCh.forEach(child => patch(null, child, el))
        }
      } else {
        if (typeof newCh === 'string') {
          // 之前是子元素数组，变化之后是文本内容
          hostSetElementText(el, newCh)
        } else {
          // 变化前后都是子元素数组
          updateChildren(oldCh, newCh, el)
        }
      }
    }
  }

  // 卸载组件
  const unmount = node => {
    const parentNode = node.el.parentNode
    if (parentNode) parentNode.removeChild(node.el)
  }

  const updateChildren = (oldCh, newCh, parentElement) => {
    // 参照索引
    let lastIndex = 0
    for (let i = 0; i < newCh.length; i++) {
      const newVNode = newCh[i]

      // 标识 old 中是否存在相同节点
      let hasSameVnode = false

      for (let j = 0; j < oldCh.length; j++) {
        const oldVNode = oldCh[j]
        // 判断是否是相同节点
        if (sameVnode(oldVNode, newVNode)) {
          hasSameVnode = true
          // 更新节点
          patch(oldVNode, newVNode, parentElement)
          // 判断是否需要移动
          if (j < lastIndex) {
            // 需要移动
            const prevVNode = newCh[i - 1]
            if (prevVNode) {
              // 移动
              const anchor = prevVNode.el.nextSibling
              hostInsert(oldVNode.el, parentElement, anchor)
            }
          } else {
            // 不需要移动，更新参照节点
            lastIndex = j
          }
          break
        }
      }

      // 如果 hasSameVnode 为 false 说明需要创建
      if (hasSameVnode === false) {
        const prevVNode = newCh[i - 1]
        let anchor = null
        if (prevVNode === void 0) {
          anchor = parentElement.firstChild
        } else {
          anchor = prevVNode.el.nextSibling
        }
        // 创建新节点
        patch(null, newVNode, parentElement, anchor)
      }
    }

    // 查找 OoldChidren 存在，在 newChildren 不存在的节点，删除
    for (let i = 0; i < oldCh.length; i++) {
      const oldVNode = oldCh[i]
      const sameVnode = newCh.find(v => v.key === oldVNode.key)
      if (sameVnode === false) {
        unmount(oldVNode)
      }
    }
  }

  // 返回一个渲染器实例
  return  {
    render,
    // 提供给用户一个 createApp 方法
    createApp: createAppAPI(render)
  }
}

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    // 接收根组件，返回 App 实例
    const app = {
      mount(container) {
        const vnode = createVNode(rootComponent)
        // 传入根组件的 VNode
        // 将虚拟 DOM 转为真实 DOM，并追加到宿主
        render(vnode, container)
      }
    }
    return app
  }
}