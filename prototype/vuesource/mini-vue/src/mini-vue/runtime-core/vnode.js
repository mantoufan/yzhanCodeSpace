export function createVNode(type, props, children) {
  // 返回虚拟 DOM
  return {
    type,
    props,
    children
  }
}

export function sameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}