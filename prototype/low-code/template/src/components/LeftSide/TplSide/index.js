import styles from '../index.less'
import { useCanvasByContext } from '../../../store/hooks'
import { isImgComponent } from '../../../consts'

const settings = [{
  key: 0,
  desc: '《精通 React》',
  img: '/img/i1.jpg',
  data: '{"style":{"width":320,"height":568,"backgroundColor":"#FFFFFF","backgroundImage":"","backgroundPosition":"center","backgroundSize":"cover","backgroundRepeat":"no-repeat","boxsizing":"content-box"},"cmps":[{"key":"v27bqohoo","value":"标题","style":{"position":"absolute","top":69,"left":77,"width":80,"height":50,"borderRadius":"50%","borderStyle":"none","borderWidth":"0","borderColor":"#00000000","transform":0,"lineHeight":"50px","fontSize":28,"fontWeight":"normal","color":"#000","backgroundColor":"transparent","textAlign":"left"},"type":1},{"key":"mu6hd97tx","value":"/img/i3.jpg","style":{"position":"absolute","top":175,"left":75,"width":149,"height":209,"borderRadius":"0%","borderStyle":"none","borderWidth":"0","borderColor":"#00000000","transform":0},"type":2},{"key":"z29x0cyp2","value":"/img/i1.jpg","style":{"position":"absolute","top":28,"left":195,"width":80,"height":80,"borderRadius":"50%","borderStyle":"none","borderWidth":"0","borderColor":"#00000000","transform":0},"type":2}]}'
}]


export default function TplSide() {
  const canvas = useCanvasByContext()
  const setCanvas = (data) => canvas.setCanvas(JSON.parse(data))
  const onDragStart = (e, _cmp) => {
    // 模板不支持拖拽
    e.dataTransfer.setData('data-cmp', '')
  }

  return <div className={styles.main}>
    <ul className={styles.box}>
      {settings.map(item=>(
      <li 
        className={styles.item} 
        key={item.key} 
        onClick={()=>setCanvas(item.data)}
        draggable="true"
          onDragStart={(e) => onDragStart(e, {...item, type: isImgComponent})}
      >
        <div className={styles.desc}>{item.desc}</div>
        <img src={item.img} alt={item.src} />
      </li>
      ))}
    </ul>
  </div>
}