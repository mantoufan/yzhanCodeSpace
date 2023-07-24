import { call, fork, put, take } from "../../mini-redux-saga/effects"
import LoginService from "../../services/login"
import { LOGIN_FAILURE, LOGIN_SAGA, LOGIN_SUCCESS, REQUEST  } from "../../store/consts"

function* loginHandle(action) {
  yield put({ type: REQUEST })
  try {
    const res1 = yield call(LoginService.login, action.payload)
    const res2 = yield call(LoginService.getMoreInfo, res1)
    yield put({ type: LOGIN_SUCCESS, payload: res2 })
  } catch(err) {
    yield put({ type: LOGIN_FAILURE, payload: err })
  }
}

export default function* loginSaga() {
  // yield takeEvery(LOGIN_SAGA, loginHandle)
  while (true) {
    const action = yield take(LOGIN_SAGA)
    yield fork(loginHandle, action)
    // console.log('none blocked fork')
  }
}
