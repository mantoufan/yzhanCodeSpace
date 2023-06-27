import compose from './compose'
const applyMiddleware = (...middlewares) => {
  return createStore => reducer => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    const midAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    const middlewareChain = middlewares.map(middleware => middleware(midAPI))
    
    dispatch = compose(...middlewareChain)(store.dispatch)
    
    return {
      ...store,
      // 加强版的 dispatch
      dispatch,
    }
  }
}
export default applyMiddleware