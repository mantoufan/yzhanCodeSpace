import { all } from '../../mini-redux-saga/effects'
import loginSaga from './loginSaga'

export default function* rootSaga() {
  yield all([
    loginSaga()
  ])
}