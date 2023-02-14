import { createFiber } from "./ReactFiber"
import { isArray, isStingOrNumber, updateNode } from "./utils"

// 原生元素
export function updateHostComponent(workInProgress) {
  if (workInProgress.stateNode === null) { // 生成 Element 挂载到 stateNode 上
    workInProgress.stateNode = document.createElement(workInProgress.type)
    updateNode(workInProgress.stateNode, workInProgress.props)
  }
  reconcileChildren(workInProgress, workInProgress.props.children)
  console.log('workInProgress', workInProgress)
}
// 函数组件
export function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress
  const children = type(props) // 直接执行函数
  reconcileChildren(workInProgress, children)
}
// 类组件
export function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress
  const instance = new type(props)
  const children = instance.render()
  reconcileChildren(workInProgress, children)
}
// Fragment
export function updateFragmentComponent(workInProgress) {
  reconcileChildren(workInProgress, workInProgress.props.children)
  
}
// 文本节点
export function updateHostTextComponent(workInProgress) {
  workInProgress.stateNode = document.createTextNode(workInProgress.props.children)
}

// 协调（diff）
function reconcileChildren(workInProgress, children) {
  if (isStingOrNumber(children)) return
  const newChildren = isArray(children) ? children : [ children ]
  const n = newChildren.length
  let previousNewFiber = null
  for (let i = 0; i < n; i++) {
    const newChild = newChildren[i]
    if (newChild === null) continue // 跳过 null 渲染的空节点
    const newFiber = createFiber(newChild, workInProgress)

    // 放入链表
    if (previousNewFiber === null) {
      // head node
      workInProgress.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
}