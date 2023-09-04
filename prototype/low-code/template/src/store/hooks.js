import { useContext, useRef } from "react"
import { CanvasContext } from "../Context"
import Canvas from "./canvas"

export function useCanvas() {
  const canvasRef = useRef()
  if (canvasRef.current === void 0) {
    const canvas = new Canvas()
    canvasRef.current = canvas.getPublicCanvas()
  }
  return canvasRef.current
}

// 获取操作 canvas 数据的函数 / 实例本身
export function useCanvasByContext() {
  const canvas = useContext(CanvasContext)
  return canvas
}

// 获取 canvas 数据
export function useCanvasData() {
  const canvas = useContext(CanvasContext)
  return canvas.getCanvas()
}

export function useCanvasCmps() {
  const canvas = useContext(CanvasContext)
  return canvas.getCanvasCmps()
}