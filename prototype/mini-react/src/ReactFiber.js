import { ClassComponent, FunctionComponent, HostComponent, HostText, Fragment } from "./ReactWorkTags"
import { isFn, isStr, isUndefined, Placement } from "./utils"

export function createFiber(vnode, returnFiber) {
  // console.log('vnode', vnode)
  const fiber = {
    // 类型
    type: vnode.type,
    key: vnode.key,
    // 属性
    props: vnode.props,
    // 不同类型的组件，stateNode 不同
    // 原生标签 dom 节点
    // class 实例
    stateNode: null,
    // 第一个子 Fiber
    child: null,
    // 下一个兄弟 Fiber
    sibling: null,
    return: returnFiber,
    flags: Placement,
    // 记录节点在当前层级下的位置
    index: null
  }

  const { type } = vnode
  
  if (isStr(type)) {
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    // todo 区分函数组件和类组件
    fiber.tag = type.prototype.isReactComponent ? ClassComponent : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    fiber.props = { children: vnode }
  } else {
    fiber.tag = Fragment
  }
  
  return fiber
}