import { useRef } from "react"

const defaultCanvas = {
  style: {
    width: 320,
    height: 568,
    backgroundColor: '#ffff00',
    backgroundImage: '',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    boxsizing: 'content-box',
  },
  // 组件
  cmps: [
    {
      // key: getOnlyKey(),
      desc: '文本',
      value: '文本',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 100,
        height: 30,
        fontSize: 12,
        color: 'red'
      }
    }
  ]
}

class Canvas {
  constructor(_canvas = defaultCanvas) {
    this.canvas = _canvas // 页面数据
  }
  getCanvas = () => {
    return { ...this.canvas }
  }
  setCanvas = (_canvas) => {
    Object.assign(this.canvas, _canvas)
  }
}

export function useCanvas() {
  const canvasRef = useRef()
  let canvas = canvasRef.current
  if (canvas === null) {
    canvas = new Canvas()
    canvasRef.current = canvas
  }
  return canvasRef.current
}