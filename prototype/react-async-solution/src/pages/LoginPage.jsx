import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { login } from "../action/user-saga"

export default function LoginPage() {
  const user = useSelector(({ user }) => user)

  const location = useLocation()

  const dispatch = useDispatch()

  const from = location.state?.from?.pathname || "/" 

  if (user.isLogin) {
    return <Navigate to={from} replace={true} />
  }

  const submit = (e) => {
    e.preventDefault()
    const formDate = new FormData(e.target)
    const username = formDate.get("username")
    dispatch(login({ username }))
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">{user.loading ? 'loading..' : 'login'}</button>
      </form>
      <p style={{color: 'red'}}>{user.err.msg}</p>
    </div>
  )
}