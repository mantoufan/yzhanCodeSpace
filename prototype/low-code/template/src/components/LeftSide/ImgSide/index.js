import styles from '../index.less'
import { useCanvasByContext } from '../../../store/hooks'
import { isImgComponent, defaultCommonStyle } from '../../../consts'
const defaultStyle = {
  ...defaultCommonStyle,
}

const settings = [
  {
    value: '/img/i1.jpg',
    style: defaultStyle,
  }, 
  {
    value: '/img/i2.jpg',
    style: defaultStyle,
  },
  {
    value: '/img/i3.jpg',
    style: defaultStyle,
  },
  {
    value: '/img/i4.jpg',
    style: defaultStyle,
  },
]

export default function ImgSide() {
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
          onClick={() => addCmp({ ...item, type: isImgComponent })}
          draggable="true"
          onDragStart={(e) => onDragStart(e, {...item, type: isImgComponent})}
        ><img src={item.value} alt={item.value} /></li>
      ))}
    </ul>
  </div>
}