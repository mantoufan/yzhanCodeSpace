import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent, updateHostTextComponent } from "./ReactFiberReconciler";
import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from "./ReactWorkTags"
import { Placement } from "./utils";

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
    workInProgress = workInProgress.child
    return 
  }

  let next = workInProgress
  while (next) {
    if (next.sibling) { // 有 sibling 传给 sibling
      workInProgress = next.sibling
      return
    }
    next = next.return
  }
  return 
}

function workLoop(IdleDeadline) {
  while (workInProgress !== null && IdleDeadline.timeRemaining() > 0) { // 只要浏览器有空闲时间
    performUnitOfWork()
  }
  // 遍历结束，根节点还在
  // 将 vnode 更新到 真实 dom
  if (workInProgress !== null && workInProgressRoot) {
    commitRoot()
  }
}

requestIdleCallback(workLoop)

// 提交
function commitRoot() {
  commitWorker(workInProgressRoot) // 处理一个函数的更新
  workInProgressRoot = null
}

function commitWorker(workInProgress) {
  if (workInProgress === null || workInProgress === void 0) return
  // 1. 提交自己（将 vnode 更新到真实 dom）
  
  const parentNode = getParentNode(workInProgress.return)
  const { flags, stateNode } = workInProgress
  console.log(stateNode)
  if (flags & Placement && stateNode) { // 如果是 Placement
    parentNode.appendChild(stateNode) // parentNode 是父 DOM
  }
  // 2. 提交子节点
  commitWorker(workInProgress.child)
  // 3. 提交兄弟
  commitWorker(workInProgress.sibling)
}

function getParentNode(workInProgress) {
  let tmp = workInProgress
  while (tmp.stateNode === null) {
    tmp = tmp.return
  }
  return tmp.stateNode
}