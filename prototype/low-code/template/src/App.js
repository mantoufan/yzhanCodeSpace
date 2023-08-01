import styles from './App.less'
import Headers from './layout/Header'
import Left from './layout/Left'
import Center from './layout/Center'
import Right from './layout/Right'
import { useCanvas } from './store/canvas'

export default function App(props) {
  const canvas = useCanvas()
  return (
    <div className={styles.main}>
      <Headers />
      <div className={styles.content}>
        <Left />
        <Center />
        <Right />
      </div>
    </div>
  )
}
