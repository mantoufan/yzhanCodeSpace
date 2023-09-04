import styles from '../index.less'
import { useCanvasByContext } from '../../../store/hooks'
import { isTextComponent, defaultCommonStyle } from '../../../consts'

const defaultStyle = {
  ...defaultCommonStyle,
  width: 170,
  height: 30,
  lineHeight: '30px',
  fontSize: 12,
  fontWeight: 'normal',
  color: '#000',
  backgroundColor: 'transparent',
  textAlign: 'left',
}

const settings = [
  {
    value: '双击编辑标题',
    style: {
      ...defaultStyle,
      fontSize: 28,
      height: 50,
      lineHeight: '50px',
    }
  }, 
  {
    value: '双击编辑正文',
    style: defaultStyle
  }
]

export default function TextSide() {
  const canvas = useCanvasByContext()
  const addCmp = _cmp => {
    canvas.addCmp(_cmp)
  }
  const onDragStart = (e, _cmp) => {
    e.dataTransfer.setData('data-cmp', JSON.stringify(_cmp))
  }
  
  return <div className={styles.main}>
    <ul className={styles.box}>
      {settings.map(item => (
        <li 
          key={item.value} 
          className={styles.item} 
          onClick={() => addCmp({ ...item, type: isTextComponent })}
          draggable="true"
          onDragStart={(e) => onDragStart(e, {...item, type: isTextComponent})}
        >{item.value.indexOf('双击编辑') > -1 ? item.value.slice(4) : item.value}</li>
      ))}
    </ul>
  </div>
}