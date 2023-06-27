import { useReducer  } from 'react'
import { countReducer } from '../store'
export default function HooksPage(props) {
  const initializer = (initArg) => initArg - 0
  const [state, dispatch] = useReducer(countReducer, '0', initializer)
  return (
    <div>
      <h3>HooksPage</h3>
      <button onClick={() => dispatch({ type: 'ADD' })}>{ state }</button>
    </div>
  )
}