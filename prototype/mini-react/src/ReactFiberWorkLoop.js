import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent, updateHostTextComponent } from "./ReactFiberReconciler";
import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from "./ReactWorkTags"

let workInProgress = null // 当前正在执行的 Fiber
let workInProgressRoot = null
export function scheduleUpdateOnFiber(fiber) {
  workInProgress = fiber
  workInProgressRoot = fiber

}

// 执行工作单元
function performUnitOfWork() {
  const { tag } = workInProgress

  // todo 1. 更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(workInProgress)
      break;
    case FunctionComponent:
      updateFunctionComponent(workInProgress)
      break;
    case ClassComponent:
      updateClassComponent(workInProgress)
      break;
    case Fragment:
      updateFragmentComponent(workInProgress)
      break;
    case HostText:
      updateHostTextComponent(workInProgress)
      break;
    default:
      break;
  }
  // todo 2. 下一个更新谁 深度优先遍历（国王的故事）
  if (workInProgress.child) { // 有 child 传给 child
    workInProgress = child
    return 
  }

  let next = workInProgress
  while (next) {
    if (next.sibling) { // 有 sibiling 传给 sibling
      workInProgress = next.sibling
      return
    }
    next = next.return
  }
  return 
}