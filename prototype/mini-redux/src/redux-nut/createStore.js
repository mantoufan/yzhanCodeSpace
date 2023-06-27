export function createStore (reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }
  let currentState
  const currentListeners = []

  function getState() {
    return currentState
  }
  function dispatch(action, getState) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(listener => listener())
  }
  function subscribe(listener) {
    currentListeners.push(listener)
    return () => {
      const index = currentListeners.indexOf(listener)
      currentListeners.splice(index, 1)
    }
  }

  dispatch({ type: 'Random'})
  return {
    getState,
    dispatch,
    subscribe
  }
}