import { useCanvasByContext } from '../../store/hooks'
import Item from '../Item'
import InputColor from '../InputColor'
import { isImgComponent } from '../../consts'

export default function EditCmp({ styles }) {
  const canvas = useCanvasByContext()
  const selectedCmp = canvas.getSelectedCmp()
  const { value, style } = selectedCmp

  const handleStyleChange = (_, {name, value}) => {
    const newStyle = {[name]: value}
    canvas.updateSelectedCmp(newStyle)
    canvas.recordCanvasChangeHistory()
  }

  const handleValueChange = (e) => {
    canvas.updateSelectedCmp(null, e.target.value)
    canvas.recordCanvasChangeHistory()
  }

  return <div className={styles.main}>
    <div className={styles.title}>组件属性</div>
    { 
      selectedCmp.type === isImgComponent &&
      <Item label="描述：" >
        <input type="text" className={styles.itemRight} value={value} onChange={handleValueChange} />
      </Item>
    }
    {
      style.fontSize !== void 0 && 
      <Item label="字体大小:" >
       <input type="number" className={styles.itemRight} value={style.fontSize} onChange={e => handleStyleChange(e, {name: 'fontSize', value: +e.target.value})} />
      </Item>
    }
    {
      style.fontWeight !== void 0 && 
      <Item label="字体粗细:">
        <select className={styles.itemRight} value={style.fontWeight} onChange={e => handleStyleChange(e, {name: 'fontWeight', value: e.target.value})}>
          <option value="normal">normal</option>
          <option value="bold">bold</option>
          <option value="lighter">lighter</option>
        </select>
      </Item>
    }
    {
      style.lineHeight !== void 0 && 
      <Item label="行高:">
        <input type="number" className={styles.itemRight} value={parseInt(style.lineHeight)} onChange={e => handleStyleChange(e, {name: 'lineHeight', value: e.target.value + 'px'})} />
      </Item>
    }
    {
      style.textAlign !== void 0 &&
      <Item label="对齐">
        <select
          className={styles.itemRight}
          value={style.textAlign}
          onChange={e => {
            handleStyleChange(e, {
              name: 'textAlign',
              value: e.target.value,
            });
          }}
        >
          <option value="left">居左</option>
          <option value="center">居中</option>
          <option value="right">居右边</option>
        </select>
      </Item>
    }
    {
      style.transform !== void 0 &&
      <Item label="旋转:">
        <input
          className={styles.itemRight}
          type="number"
          value={style.transform}
          onChange={(e) =>
          handleStyleChange(e, {
            name: "transform",
            value: +e.target.value,
          })
          }
        />
      </Item>
    }
    {
      style.borderRadius !== void 0 &&
      <Item label="圆角:">
        <input
          className={styles.itemRight}
          type="text"
          value={style.borderRadius}
          onChange={(e) =>
          handleStyleChange(e, {
            name: "borderRadius",
            value: e.target.value,
          })
          }
        />
      </Item>
    }
    <Item label="边框样式">
      <select
        className={styles.itemRight}
        value={style.borderStyle}
        onChange={e => {
        handleStyleChange(e, {
          name: "borderStyle",
          value: e.target.value,
        })
      }}>
        <option value="none">none</option>
        <option value="dashed">dashed</option>
        <option value="dotted">dotted</option>
        <option value="double">double</option>
        <option value="groove">groove</option>
        <option value="hidden">hidden</option>
        <option value="solid">solid</option>
      </select>
    </Item>
    <Item label="边框宽度">
      <input
        className={styles.itemRight}
        type="number"
        value={style.borderWidth}
        onChange={e =>
          handleStyleChange(e, {
            name: "borderWidth",
            value: e.target.value - 0,
          })
        }
      />
    </Item>
    <Item label="边框颜色">
      <InputColor
        className={styles.itemRight}
        color={style.borderColor || "#00000000"}
        onChangeComplete={(e) =>
          handleStyleChange(null, {name: "borderColor", value: e.hex})
        }
      />
    </Item>
    {
      style.color !== void 0 &&
      <Item label="字体颜色">
        <InputColor
          className={styles.itemRight}
          color={style.color}
          onChangeComplete={e =>
            handleStyleChange(null, {name: "color", value: e.hex})
          }
        />
      </Item>
    }
    {
      style.backgroundColor !== void 0 && 
      <Item label="背景颜色">
        <InputColor
          className={styles.itemRight}
          color={style.backgroundColor}
          onChangeComplete={(e) =>
            handleStyleChange(null, {name: "backgroundColor", value: e.hex})
          }
        />
      </Item>
    }
  </div>
}