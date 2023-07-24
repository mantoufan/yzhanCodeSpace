import { LOGIN_SAGA, LOGOUT_SUCCESS } from "../store/consts"

export const login = userInfo => ({ type: LOGIN_SAGA, payload: userInfo })


export const logout = userInfo => ({ type: LOGOUT_SUCCESS, payload: userInfo })