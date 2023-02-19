
import { createFiber } from "./ReactFiber"
import { isArray, isStingOrNumber, Placement, Update } from "./utils"
// 协调（diff）
export function reconcileChildren(workInProgress, children) {
  if (isStingOrNumber(children)) return
  const newChildren = isArray(children) ? children : [ children ]

  // OldFiber 头节点
  let oldFiber = workInProgress.alternate?.child
  // 下一个 oldFiber 或 暂时缓存 OldFiber
  let nextOldFiber = null
  let previousNewFiber = null
  let newIndex = 0

  // 用于判断 returnFiber 初次渲染还是更新：判断父节点是否有老节点
  let shouldTrackSideEffects = !!workInProgress.alternate
  // 上一次插入节点的位置：上一次 dom 节点的最远位置
  // old: 0 1 2 3 4
  // new: 2 1 3 4
  // 2（lastPlaceIndex = 2）1（1 < lastPlaceIndex，需要移动）3（3 > lastPlaceIndex，不需要移动）
  let lastPlacedIndex = 0

  // *1. 从左往右遍历，比较新老节点，如果节点可以复用，继续往右，否则就停止
  for (; oldFiber && newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex]
    if (newChild === null) continue

    if (oldFiber.index > newIndex) {
      nextOldFiber = oldFiber
      oldFiber = null
    } else {
      nextOldFiber = oldFiber.sibling
    }

    const same = sameNode(newChild, oldFiber) 
    if (same === false) {
      if (oldFiber === null) oldFiber = nextOldFiber
      break
    }

    const newFiber = createFiber(newChild, workInProgress)

    Object.assign(newFiber, {
      stateNode: oldFiber.stateNode,
      alternate: oldFiber,
      flags: Update
    })

    // 更新
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects)

    if (previousNewFiber === null) {
      workInProgress.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }

    previousNewFiber = newFiber
    // oldFiber 向后移动
    oldFiber = nextOldFiber
  }

  // *2 新节点没了，老节点还有
  // old: 0, 1, 2
  // new：0
  // 判断新节点遍历完：删除老节点
  if (newIndex === newChildren.length) {
    deleteRemainingChildren(workInProgress, oldFiber)
  }

  // *3. 初次渲染
  // 1）初次渲染
  // 2）老节点没有，新节点还有
  if (oldFiber === null || oldFiber === void 0) {
    for (; newIndex < newChildren.length; newIndex++) {
      const newChild = newChildren[newIndex]
      if (newChild === null) continue // 跳过 null 渲染的空节点
      const newFiber = createFiber(newChild, workInProgress)

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects)

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
  
  // *4. 新老节点都还有
  // old: 0 1 [2 3 4]
  // new: 0 1 [3 4]
  // ?4.1 构建哈希表：把剩下的 old 单向链表构建哈希表（React 是构建剩余老节点，Vue 是新哈希表）
  const existingChildren = mapRemainingChildren(oldFiber)
  // ?4.2 遍历新节点，通过新节点的 key 取哈希表中查找节点，找到就复用节点，并删除哈希表中对应的节点
  for (; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex]
    if (newChild === null) continue
    const newFiber = createFiber(newChild, workInProgress)

    // oldFiber
    const matchedFiber = existingChildren.get(newFiber.key || newFiber.index)
    if (matchedFiber) {
      // 节点复用
      Object.assign(newFiber, {
        stateNode: matchedFiber.stateNode,
        alternate: matchedFiber,
        flags: Update
      })
      existingChildren.delete(newFiber.key || newFiber.index)
    }

    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects)

    if (previousNewFiber === null) {
      workInProgress.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
  // *5 old 的哈希表中还有值，遍历哈希表删除所有 old
  if (shouldTrackSideEffects) {
    existingChildren.forEach(child => deleteChild(workInProgress, child))
  }
}
// 比较新老 Node 区别
// 节点复用条件：同一层级、类型相同、key 相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key
}

// 删除节点
// 给父 Fiber 上加一个数组
// returnFiber.deletions = [a, b, c]
function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions
  if (deletions) {
    deletions.push(childToDelete)
  } else {
    returnFiber.deletions = [ childToDelete ]
  }
}

// 删除剩余节点
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
}

// 初次渲染：只记录下标
// 更新：检查节点是否移动
function placeChild(
  newFiber,
  lastPlacedIndex, 
  newIndex,
  shouldTrackSideEffects
) {
  newFiber.index = newIndex
  if (shouldTrackSideEffects === false) {
    // 父节点初次渲染
    return lastPlacedIndex
  }
  // 父节点更新
  // 判断子节点是初次渲染还是更新
  const current = newFiber.alternate
  if (current) {
    const oldIndex = current.index
    // 子节点是更新
    // old: 0 1 2 3 4
    // new: 2 1 3 4
    // 2(2) 1(1)
    if (oldIndex < lastPlacedIndex) {
      // move
      newFiber.flags |= Placement
      return lastPlacedIndex
    } else {
      return oldIndex
    }
  } else {
    // 子节点是初次渲染
    newFiber.flags |= Placement
    return lastPlacedIndex
  }
}

// 将剩余 old 构建哈希表
function mapRemainingChildren(currentFirstChild) {
  const existingChildren = new Map()
  let existingChild = currentFirstChild
  while (existingChild) {
    // Map<key || index, Fiber> 
    existingChildren.set(existingChild.key || existingChild.value, existingChild)
    existingChild = existingChild.sibling
  }
  return existingChildren
}