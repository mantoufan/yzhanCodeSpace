import React, { useCallback, useContext, useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { bindActionCreators } from '../redux-nut'

// 1. 创建 context 对象
const Context = React.createContext()

// 2. 创建 Provider
export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>
}

// 3. 消费 context
// useContext 类组件或自定义 hook 中
// Consumer 类组件，函数组件都可以
// contextType 只能用在类组件，只能订阅单一的 context 来源

export const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => props => {
  const store = useContext(Context)
  const { getState, dispatch, subscribe } = store 
  const forceUpdate = useForceUpdate()
   /* Before: React 18 */
  // useLayoutEffect(() => {
  //   const unsubscribe = subscribe(() => {
  //     forceUpdate()
  //   })
  //   return () => {
  //     unsubscribe()
  //   }
  // }, [subscribe, forceUpdate])
  /* After: React 18 */
  const state = useSyncExternalStore(() => subscribe(forceUpdate), getState)
  const stateProps = mapStateToProps(state, props)
  let dispatchProps = { dispatch }
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch)
  } else  if (typeof mapDispatchToProps === 'object') {
    Object.assign(dispatchProps, bindActionCreators(mapDispatchToProps, dispatch))
  }
 
  return <WrappedComponent {...props} {...stateProps} {...dispatchProps}/>
}

export function useForceUpdate() {
  const [, setState] = useState(0)
  const update = useCallback(() => {
    setState(state => state + 1)
  }, [])
  return update
}

export function useSelector(selelctor) {
  const store = useContext(Context)
  const { getState, subscribe } = store
  const selectedState  = selelctor(getState())
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate()
    })
    return () => {
      unsubscribe()
    }
  }, [subscribe, forceUpdate])
  return selectedState
}

export function useDispatch() {
  const store = useContext(Context)
  const { dispatch } = store
  return dispatch
}