import { createFiber } from "./ReactFiber"
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function (children) {
  // console.log('children', children) // sy-log
  const root = this._internalRoot
  updateContainer(children, root)
}

function updateContainer(element, container) {
  const { containerInfo } = container
  const fiber = createFiber(element, { // 创建父节点
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo
  })
  // 组件初次渲染
  scheduleUpdateOnFiber(fiber)
}

function createRoot(container) {
  const root = { containerInfo: container }
  return new ReactDOMRoot(root)
}

export default { createRoot }