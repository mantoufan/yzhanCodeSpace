import LoginService from "../services/login"
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS, REQUEST } from "../store/consts"

// export const login = userInfo => ({ type: LOGIN_SUCCESS, payload: userInfo })
export const login = userInfo => async(dispatch) => {
  dispatch({ type: REQUEST })
  try {
   const res = await LoginService.login(userInfo)
   await getMoreInfo(dispatch, res)
  } catch (err) {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  }
}

export const getMoreInfo = async(dispatch, userInfo) => {
  try {
    const res = await LoginService.getMoreInfo(userInfo)
    dispatch({ type: LOGIN_SUCCESS, payload: res })
  } catch (err) {
    dispatch({ type: LOGIN_FAILURE, payload: err })
  }
}

export const logout = userInfo => ({ type: LOGOUT_SUCCESS, payload: userInfo })