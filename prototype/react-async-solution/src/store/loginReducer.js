import { REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from './consts'

const userInit = {
  isLogin: false,
  userInfo: { id: null, name: "", score: 0 },
  loading: false,
  err: { msg: "" }
}

// Define a modified reducer
export const loginReducer = (state = { ...userInit }, { type, payload }) => {
  switch (type) {
    case REQUEST:
      return { ...state, loading: true }
    case LOGIN_SUCCESS:
      return { ...state, loading: false, isLogin: true, userInfo: { ...payload } }
    case LOGIN_FAILURE:
      return { ...state, ...userInit, ...payload }
    case LOGOUT_SUCCESS:
      return { ...userInit, isLogin: false, loading: false }
    default:
      return state
  }
}