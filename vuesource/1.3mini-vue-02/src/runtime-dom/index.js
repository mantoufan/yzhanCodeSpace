export const nodeOps = {
  createText(text) {
    return document.createTextNode(text)
  },
  createElement(tagName) {
    return document.createElement(tagName)
  },
  insert(element, container, anchor) {
    container.insertBefore(element, anchor || null)
  },
  patchProp(el, key, prevVaule, curValue) {
    if (key.startsWith('on')) {
      el.addEventListener(key.substring(2).toLowerCase(), curValue)
    } else {
      el.setAttribute(key, curValue)
    }
  },
  setElementText(el, text) {
    el.textContent = text
  }
}