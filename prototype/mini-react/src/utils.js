// ! flags
export const NoFlags = 0b00000000000000000000000000
// 新增、插入、移动
export const Placement = 0b00000000000000000000000010
// 节点更新属性
export const Update = 0b00000000000000000000000100
// 删除
export const Deletion = 0b00000000000000000000001000

// HookFlags
export const HookLayout = 0b010
export const HookPassive = 0b100

export function isStr(s) {
  return typeof s === 'string'
}
export function isStingOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number'
}
export function isFn(fn) {
  return typeof fn === 'function'
}
export function isArray(arr) {
  return Array.isArray(arr)
}
export function isUndefined(s) {
  return s === void 0
}
// old props { className: 'red', id： '_id' }
// new props { className: 'green' }
export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal).forEach(k => {
    if (k === 'children') {
      if (isStingOrNumber(nextVal[k])) node.textContent = ''
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLowerCase()
      node.removeEventListener(eventName, prevVal[k])
    } else {
      if (nextVal[k] === void 0) node[k] = ''
    }
  })
  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      if(isStingOrNumber(nextVal[k])) node.textContent = nextVal[k]
    } else if (k.slice(0, 2) === 'on') {
      // fack 事件
      const eventName = k.slice(2).toLowerCase()
      node.addEventListener(eventName, nextVal[k])
    } else {
      node[k] = nextVal[k]
    }
  })
}

export function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return false
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(prevDeps[i], nextDeps[i]) === false) return false
  }
  return true
}