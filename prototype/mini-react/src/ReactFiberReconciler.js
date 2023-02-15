import { renderWithHooks } from "./hooks"
import { reconcileChildren } from "./ReactChildFiber"
import { updateNode } from "./utils"

// 原生元素
export function updateHostComponent(workInProgress) {
  if (workInProgress.stateNode === null) { // 生成 Element 挂载到 stateNode 上
    workInProgress.stateNode = document.createElement(workInProgress.type)
    updateNode(workInProgress.stateNode, {}, workInProgress.props)
  }
  reconcileChildren(workInProgress, workInProgress.props.children)
  // console.log('workInProgress', workInProgress)
}
// 函数组件
export function updateFunctionComponent(workInProgress) {
  // Process hooks
  renderWithHooks(workInProgress)
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