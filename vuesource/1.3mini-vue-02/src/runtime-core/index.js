import { createVNode, createTextNode } from './vnode.js'
import { compile } from '../compiler'
export const Text = Symbol('text')
export function createRenderer (options) {
  const {
    createText,
    createElement,
    insert,
    patchProp,
    setElementText,
  } = options
  const patch = (vnode, container) => {
    // ... 之前 render 中 if 部分的代码
    const { tag } = vnode
      if(typeof tag === 'string') {
        // 挂载元素
        mountElement(vnode, container)
      } else if (tag === Text) {
        // 挂载文本节点
        mountTextNode(vnode, container)
      } else if (typeof tag === 'object') {
        mountComponent(vnode, container)
      }
  }
  const render = (vnode, container) => {
    if(vnode) {
      patch(vnode, container)
    } else {
      container.innerHTML = ''
    }
    // 存储vnode作为下次更新时的oldvnode
    container._vnode = vnode
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
    patch(childVNode, container)
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
        patch(child, el)
      })
    }
    insert(el, container)
  }
  // renderer
  return {
    render
  }
}