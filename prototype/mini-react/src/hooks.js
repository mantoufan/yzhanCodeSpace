import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"
import { HookLayout, HookPassive, areHookInputsEqual } from "./utils"

let currentlyRenderingFiber = null
let workInProgressHook = null // 当前真正工作的 hook
let currentHook = null // previous hook

export function renderWithHooks(workInProgress) {
  currentlyRenderingFiber = workInProgress
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null

  // Using arrays to track the currently rendering fibers
  currentlyRenderingFiber.updateQueueOfEffect = []
  currentlyRenderingFiber.updateQueueOfLayout = []
}

function updateWorkInProgressHook() {
  let hook = null

  const current = currentlyRenderingFiber.alternate

  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState // 复用老节点的 state
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
      currentHook = currentHook.next
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState
      currentHook = current.memorizedState
    }
  } else {
    // 组件初次渲染
    currentHook = null
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

function updateEffectImp(hooksFlags, create, deps) {
  const hook = updateWorkInProgressHook()
  if (currentHook) {
    const prevEffect =  currentHook.memorizedState
    if (deps) {
      const prevDeps = prevEffect.deps
      if (areHookInputsEqual(deps, prevDeps)) return
    }
  }
  const effect = { hooksFlags, create, deps }

  hook.memorizedState = effect

  if (hooksFlags & HookPassive) {
    currentlyRenderingFiber.updateQueueOfEffect.push(effect)
  } else if (hooksFlags & HookLayout) {
    currentlyRenderingFiber.updateQueueOfLayout.push(effect)
  }
}

export function useEffect(create, deps) {
  return updateEffectImp(HookPassive, create, deps)
}

export function useLayoutEffect(create, deps) {
  return updateEffectImp(HookLayout, create, deps)
}