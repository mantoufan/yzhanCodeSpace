import { useCallback } from 'react'
import { useSelector, useDispatch } from '../react-redux-nux'
export default function ReactReduxHookPage(props) {
  const count = useSelector(({ count }) => count)
  const dispatch = useDispatch()
  const add = useCallback(() => dispatch({ type: 'ADD' }), [dispatch])
  return (
    <div>
      <h3>ReactReduxHookPage</h3>
      <button onClick={add}>add:{count}</button>
    </div>
  )
}