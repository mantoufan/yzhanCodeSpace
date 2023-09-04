import { useState } from "react"
import { SketchPicker } from 'react-color'

export default function InputColor({ onChangeComplete, color, ...rest }) {
  const [visible, setVisible] = useState(false)
  return (
    <div style={{
      position: 'relative',
      backgroundColor: color
    }}
    {...rest}
    onClick={() => {
      if (visible === false) {
        setVisible(true)
      }
    }}>
      {visible && 
        <div
          style={{
            zIndex: 1,
            position: 'relative',
            marginTop: '32px',
            marginLeft: '-70px',
          }}>
            <span style={{
              zIndex: 999,
              position: 'absolute',
              top: 0,
              left: '4px',
              color: '#999',
              cursor: 'pointer'
            }}
            onClick={() => {
              setVisible(false)
            }}>
              关闭
            </span>
            <SketchPicker color={color} onChangeComplete={onChangeComplete} />
        </div>
      }
    </div>
  )
}