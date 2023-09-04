import styles from '../index.less'
import { useCanvasByContext } from '../../../store/hooks'
import { defaultCommonStyle, isGraphComponent } from '../../../consts'

const defaultStyle = {
  ...defaultCommonStyle,
  width: 120,
  height: 120,
  borderColor: 'blue',
  backgroundColor: 'blue',
}

const settings = [
  {
    value: '',
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
    }
  }, 
  {
    value: '',
    style: defaultStyle
  }
]

export default function GraphSide() {
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
          style={{
            width: item.style.width,
            height: item.style.height,
            backgroundColor: item.style.backgroundColor,
            borderStyle: item.style.borderStyle,
            borderColor: item.style.borderColor
          }}
          onClick={() => addCmp({ ...item, type: isGraphComponent })}
          draggable="true"
          onDragStart={(e) => onDragStart(e, {...item, type: isGraphComponent})}
        >{item.value}</li>
      ))}
    </ul>
  </div>
}