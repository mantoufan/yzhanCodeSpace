// ! flags
export const NoFlags = 0b00000000000000000000000000
// 新增、插入
export const Placement = 0b00000000000000000000000010
// 节点更新属性
export const Update = 0b00000000000000000000000100
// 删除
export const Deletion = 0b00000000000000000000001000

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

