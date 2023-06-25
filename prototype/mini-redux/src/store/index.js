import { createStore } from '../redux-nut'
const countReducer = (state = 0, action) => {
  switch (action.type) {
    case 'ADD': 
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}
const store = createStore(countReducer)
export default store