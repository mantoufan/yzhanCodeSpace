import { createRenderer } from "../runtime-core"
// runtime-dom
let renderer

// dom 平台特有的节点操作
const rendererOptions = {
  querySelector(selector) {
    return document.querySelector(selector)
  },
  insert(child, parent, anchor) {
    parent.insertBefore(child, anchor || null)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  createElement(tag) {
    return document.createElement(tag)
  },
  remove(el) {
    const parent = el.parentNode
    if (parent) parent.removeChild(el)
  }
}

// 确保 renderer 单例
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}

// 创建 App 实例
export function createApp(rootComponent) {
  const app = ensureRenderer().createApp(rootComponent)
  const mount = app.mount
  app.mount = (selectorOrContainer) => {
    const container = document.querySelector(selectorOrContainer)
    mount(container)
  }
  return app
}