import { createRenderer } from '../runtime-core'
// runtime-dom 一个平台只有一个渲染器
let renderer;

// dom 平台特有的节点操作
const rendererOptions = {
  querySelector(selector) {
    return document.querySelector(selector)
  },
  insert(child, parent, anchor) {
    // 设置为 null 为 appendChild
    parent.insertBefore(child, anchor || null)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  createElement(tag) {
    return document.createElement(tag)
  }
}

// 确保 renderer 单例模式
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
// 创建 APP 实例
export function createApp(rootComponent) {
  // console.log(rootComponent)
  // 接收根组件，返回 App 实例
  const app = ensureRenderer().createApp(rootComponent)
  const mount = app.mount
  app.mount = function (selectorOrContainer) {
    const container = typeof selectorOrContainer === 'string' ? document.querySelector(selectorOrContainer)
                                                              : selectorOrContainer
    mount(container)
  }
  return app
}