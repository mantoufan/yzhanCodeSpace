import { useLayoutEffect, useRef, useState } from "react";
import Router from "./Router";
import { createBrowserHistory } from 'history'

export default function BrowserRouter({children}) {
  let historyRef = useRef()
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory()
  }
  const history = historyRef.current

  const [state, setState] = useState({location: history.location})

  useLayoutEffect(() => {
    history.listen(setState)
  }, [state])

  return <Router children={children} navigator={history} location={state.location}/>
}