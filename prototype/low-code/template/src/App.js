import styles from './App.less'
import Headers from './layout/Header'
import Left from './layout/Left'
import Center from './layout/Center'
import Right from './layout/Right'
import { useCanvas } from './store/hooks'
import { CanvasContext } from './Context'
import { useEffect, useReducer } from 'react'

export default function App(props) {
  const canvas = useCanvas()
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  useEffect(() => {
    const unsubscribe = canvas.subscribe(() => {
      forceUpdate()
    })
    return () => {
      unsubscribe()
    }
  }, [canvas])
  return (
    <div className={styles.main}>
      <CanvasContext.Provider value={canvas}>
        <Headers />
        <div className={styles.content}>
          <Left />
          <Center />
          <Right />
        </div>
      </CanvasContext.Provider>
    </div>
  )
}
