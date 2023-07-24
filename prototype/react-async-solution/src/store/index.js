import { applyMiddleware, combineReducers, createStore } from 'redux'
import { loginReducer } from './loginReducer'
// import thunk from 'redux-thunk'
import createSagaMiddleware from '../mini-redux-saga'
import rootSaga from '../action/sages/rootSaga'

const sageMiddleware = createSagaMiddleware()
const store = createStore(combineReducers({
  user: loginReducer
}), applyMiddleware(sageMiddleware))
sageMiddleware.run(rootSaga)

export default store