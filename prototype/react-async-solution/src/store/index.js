import { applyMiddleware, combineReducers, createStore } from 'redux'
import { loginReducer } from './loginReducer'
import thunk from 'redux-thunk'

const store = createStore(combineReducers({
  user: loginReducer
}), applyMiddleware(thunk))

export default store