import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"

let currentlyRenderingFiber = null
let workInProgressHook = null // 当前真正工作的 hook

export function renderWithHooks(workInProgress) {
  currentlyRenderingFiber = workInProgress
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null
}

function updateWorkInProgressHook() {
  let hook = null

  const current = currentlyRenderingFiber.alternate

  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState // 复用老节点的 state
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState
    }
  } else {
    // 组件初次渲染
    hook = {
      memorizedState: null, // state
      next: null, // 下一个 hook
    }
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook
    }
  }

  return hook
}

export function useReducer(reducer, initialState) {
  const hook  = updateWorkInProgressHook()

  if (currentlyRenderingFiber.alternate === null) {
    // 初次渲染
    hook.memorizedState = initialState
  }

  // const dispatch = () => {
  //   hook.memorizedState = reducer(hook.memorizedState)
  //   currentlyRenderingFiber.alternate = { ... currentlyRenderingFiber }
  //   scheduleUpdateOnFiber(currentlyRenderingFiber)
  // }

  const dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, hook, reducer)
  return [hook.memorizedState, dispatch]
}

function dispatchReducerAction(fiber, hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action
  fiber.alternate = { ... fiber }
  // 只更新函数组件
  // fiber.sibling = null
  scheduleUpdateOnFiber(fiber)
}

export function useState(initialState) {
  return useReducer(null, initialState)
}