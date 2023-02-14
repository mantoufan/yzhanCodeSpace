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
      const eventName = key.substring(2).toLowerCase()
      if (prevVaule) {
        el.removeEventListener(eventName, prevVaule)
      }
      el.addEventListener(eventName, curValue)
    } else {
      if (curValue) {
        el.setAttribute(key, curValue)
      } else {
        el.removeAttribute(key)
      }
    }
  },
  setElementText(el, text) {
    el.textContent = text
  },
  setText(textNode, text) {
    textNode.nodeValue = text
  }
}