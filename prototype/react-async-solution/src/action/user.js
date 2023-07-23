import LoginService from "../services/login"
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS, REQUEST } from "../store/consts"

// export const login = userInfo => ({ type: LOGIN_SUCCESS, payload: userInfo })
export const login = userInfo => dispatch => {
  dispatch({ type: REQUEST })
  LoginService.login(userInfo).then(res => {
    getMoreInfo(dispatch, res)
    // dispatch({ type: LOGIN_SUCCESS, payload: res })
  }, err => {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  })
}

export const getMoreInfo = (dispatch, userInfo) => {
  LoginService.getMoreInfo(userInfo).then(res => {
    dispatch({ type: LOGIN_SUCCESS, payload: res })
  }, err => {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  })
}

export const logout = userInfo => ({ type: LOGOUT_SUCCESS, payload: userInfo })