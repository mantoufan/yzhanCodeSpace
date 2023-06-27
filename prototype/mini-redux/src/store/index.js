// import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createStore, applyMiddleware, combineReducers } from '../redux-nut'
import thunk from '../redux-nut/middleware/redux-thunk'
// import logger from '../redux-nut/middleware/redux-logger'
import promise from '../redux-nut/middleware/redux-promise'
export const countReducer = (state = 0, action) => {
  switch (action.type) {
    case 'ADD': 
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}
const store = createStore(combineReducers({
  count: countReducer
}), applyMiddleware(promise, thunk))
export default store