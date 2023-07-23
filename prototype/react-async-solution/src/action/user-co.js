import LoginService from "../services/login"
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS, REQUEST } from "../store/consts"
import co from 'co'

// export const login = userInfo => ({ type: LOGIN_SUCCESS, payload: userInfo })
export const login = userInfo => dispatch => co(function*(){
  dispatch({ type: REQUEST })
  try {
    const res = yield LoginService.login(userInfo)
    yield getMoreInfo(dispatch, res)
  } catch (err) {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  }
})

export const getMoreInfo = (dispatch, userInfo) => co(function*(){
  try {
    const res = yield LoginService.getMoreInfo(userInfo)
    dispatch({ type: LOGIN_SUCCESS, payload: res })
  } catch (err) {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  }
})

export const logout = userInfo => ({ type: LOGOUT_SUCCESS, payload: userInfo })