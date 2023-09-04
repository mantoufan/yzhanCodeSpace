import classNames from 'classnames'
import styles from './index.less'
import { useCanvasByContext } from '../../store/hooks'

export default function Header() {
  const canvas = useCanvasByContext()
  const save = () => {
    const data = canvas.getCanvas()
    console.log('data', data, JSON.stringify(data))
  }
  const empty = () => {
    canvas.setCanvas(null)
  }
  const prev = () => {
    canvas.goPrevCanvasHistory()
  }
  const next = () => {
    canvas.goNextCanvasHistory()
  }
  return (
    <div className={styles.main}>
      <div className={classNames(styles.item, styles.itemLeft)} onClick={save}>
        <span className='iconfont icon-save'></span>
        <span>保存</span>
      </div>
      <div className={classNames(styles.item, styles.itemRight)} onClick={save}>
        <span className='iconfont icon-fabu'></span>
        <span>发布</span>
      </div>
      <div className={classNames(styles.item, styles.itemRight)} onClick={empty}>
        <span className='iconfont icon-qingkong'></span>
        <span>清空</span>
      </div>
      <div className={classNames(styles.item, styles.itemRight)} onClick={next}>
        <span className='iconfont icon-redo'></span>
        <span>重做</span>
      </div>
      <div className={classNames(styles.item, styles.itemRight)} onClick={prev}>
        <span className='iconfont icon-undo'></span>
        <span>撤销</span>
      </div>
    </div>
  )
}