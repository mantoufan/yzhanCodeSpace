import { useCanvasByContext } from '../../store/hooks'
import InputColor from '../InputColor'
import Item from '../Item'

export default function EditCanvas({ styles}) {
  const canvas = useCanvasByContext()
  const style = canvas.getCanvas().style
  const handleStyleChange = (e, {name, value}) => {
    canvas.updateCanvasStyle({ [name]: value })
  }

  return <div className={styles.main}>
    <div className={styles.title}>画布属性</div>
    <Item label="画布宽度（px）：" >
      <input type="number" className={styles.itemRight} value={style.width} onChange={e => {
        handleStyleChange(e, {name: 'width', value: +e.target.value})
      }} />
    </Item>
    <Item label="画布高度（px）：" >
      <input type="number" className={styles.itemRight} value={style.height} onChange={e => {
        handleStyleChange(e, {name: 'height', value: +e.target.value})
      }} />
    </Item>
    <Item label="背景颜色：" >
      <InputColor className={styles.itemRight} color={style.backgroundColor} onChangeComplete={e => {
        handleStyleChange(e, {name: 'backgroundColor', value: `rgba(${Object.values(e.rgb).join(",")})`})
      }} />
    </Item>
    <Item label="背景图片：" >
      <input type="text" className={styles.itemRight} value={style.backgroundImage} onChange={e => {
        handleStyleChange(e, {name: 'backgroundImage', value: e.target.value})
      }} />
    </Item>
  </div>
}

