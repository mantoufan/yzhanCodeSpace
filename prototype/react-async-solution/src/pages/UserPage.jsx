import { useDispatch, useSelector } from "react-redux"
import { logout } from "../action/user"

export default function UserPage() {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)

  return (
    <div>
      <h1>User Page</h1>
      <p>{user?.userInfo?.username}</p>
      <p>{user?.userInfo?.score}</p>
      <button onClick={() => {
        dispatch(logout())
      }}>logout</button>
    </div>
  )
}