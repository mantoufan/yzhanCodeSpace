import { createVNode, createTextNode } from './vnode.js'
import { compile } from '../compiler'
export const Text = Symbol('text')
export const createRenderer = options => {
  const {
    createText,
    createElement,
    insert,
    patchProp,
    setElementText,
    setText,
  } = options
  const patch = (oldVNode, vnode, container) => {
    // ... 之前 render 中 if 部分的代码
    const { tag } = vnode
    if (oldVNode && oldVNode.tag !== tag) {
      unmount(oldVNode)
      oldVNode = null
    }
    if(typeof tag === 'string') {
      if (oldVNode) {
        // 更新元素
        patchElement(oldVNode, vnode, container)
      } else {
        // 挂载元素
        mountElement(vnode, container)
      }
    } else if (tag === Text) {
      if (oldVNode) {
        // 更新文本节点
        patchTextNode(oldVNode, vnode)
      } else {
        // 挂载文本节点
        mountTextNode(vnode, container)
      }
    } else if (typeof tag === 'object') {
      if (oldVNode) {
        // 更新文本节点
        // updateComponent(oldVNode, vnode)
      } else {
        // 挂载组件
        mountComponent(vnode, container)
      }
    }
  }
  const render = (vnode, container) => {
    if(vnode) {
      patch(container._vnode, vnode, container)
    } else {
      // vnode 不存在，卸载，暂时这样处理
      if (container._vnode) {
        unmount(container._vnode)
      }
    }
    // 存储vnode作为下次更新时的oldvnode
    container._vnode = vnode
  }
  // 卸载组件
  const unmount = node => {
    const parentNode = node.el.parentNode
    if (parentNode) parentNode.removeChild(node.el)

  }
  // 挂载组件
  const mountComponent = (vnode, container) => {
    const { tag } = vnode
    if (tag.render === void 0) {
      const { template } = tag
      tag.render = compile(template).render
    }
    const ctx = {
      _c: createVNode,
      _v: createTextNode
    }
    if (tag.data) Object.assign(ctx, tag.data())
    const childVNode = tag.render.call(ctx)
    patch(null, childVNode, container)
    // render() { return this._c('div',null, 'xxx'}}
    // render() { return this._c('div',null, this._v('xxx'})}
  }

  // 挂载文本节点
  const mountTextNode = (vnode, container) => {
    const textNode = (vnode.el = createText(vnode.children))
    insert(textNode, container)
    // container.appendChild(textNode)
  }

  // 挂载元素
  const mountElement = (vnode, container) => {
    const el = (vnode.el = createElement(vnode.tag))
    // props
    if (typeof vnode.props === 'object' && vnode.props) {
      Object.keys(vnode.props).forEach(key => {
        patchProp(el, key, null, vnode.props[key])
      })
    }
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
      // el.textContent = vnode.children
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child =>{
        patch(null, child, el)
      })
    }
    insert(el, container)
  }

  // 更新节点
  const patchTextNode = (oldVNode, vnode) => {
    const el = (vnode.el = oldVNode.el)
    setText(el, vnode.children)
  }

  // 更新元素
  const patchElement = (oldVNode, vnode, container) => {
    const el = (vnode.el = oldVNode.el)
    // 更新属性
    const { props: oldProps = Object.create(null) } = oldVNode
    const { props = Object.create(null) } = vnode
    Object.keys(props).forEach(key => {
      if (oldProps[key] === void 0 || oldProps[key] !== props[key]) {
        patchProp(el, key, oldProps[key], props[key])
      }
    })
    Object.keys(oldProps).forEach(key => {
      if (props[key] === void 0) {
        patchProp(el, key, oldProps[key], null)
      }
    })
    // 更新子节点（文本节点 / 元素节点）
    patchChildren(oldVNode, vnode, container)
  }

  // 更新子节点
  const patchChildren = (oldVNode, vnode, container) => {
    const el = vnode.el = oldVNode.el
    if (typeof vnode.children === 'string') {
      if (typeof oldVNode.children === 'string') {
        // 老：数组，新：文本
        setElementText(oldVNode.el, vnode.children)
      } else {
        // 老：数组，新：文本
        // 卸载老节点的子节点
        oldVNode.children.forEach(child => unmount(child))
        // 设置新节点的文本
        setElementText(oldVNode.el, vnode.children)
      }
    } else {
      if (typeof oldVNode.children === 'string') {
        // 老：文本，新：数组
        // 清空老节点的文本
        setElementText(oldVNode.el, '')
        // 更新新节点的数组
        vnode.children.forEach(child => patch(null, child, el))
      } else {
        // Diff 算法的入口
        updateChildren(oldVNode, vnode, el)
      }
    }
  }
  // Diff 算法
  const updateChildren = (oldVNode, vnode, el) => {
    const oldN = oldVNode?.children?.length || 0
    const newN = vnode?.children?.length || 0
    for (let i = 0; i < Math.min(oldN, newN); i++) {
      patch(oldVNode.children[i], vnode.children[i], el)
    }
    if (newN > oldN) { // 创建
      for (let i = oldN; i < newN; i++) {
        patch(null, vnode.children[i], el)
      }
    } else if (newN < oldN) { // 删除
      for (let i = newN; i < oldN; i++) {
        unmount(oldVNode.children[i])
      }
    }
    // while (++i < gt ? m : n) {
    //   if (oldVNode.children[i] !== vnode.children[i]) {
    //     patch(oldVNode.children[i], vnode.children[i], container)
    //   }
    // }
  }
  // renderer
  return {
    render
  }
}