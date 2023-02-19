import { pop, push, peek } from "./minHeap"

const taskQueue = [] // 无需延迟的任务队列
let taskIdCounter = 1

export function scheduleCallback(callback) {
  const currentTime = getCurrentTime()
  const timeout = -1
  const expirationTime = currentTime + timeout // startTime + timeout
  const newTask = {
    id: taskIdCounter++,
    callback,
    expirationTime,
    sortIndex: expirationTime
  }

  // 向最小堆添加任务
  push(taskQueue, newTask)
  // console.log('callback', callback);
  // console.log('newTask', newTask)
  // console.log('taskQueue', taskQueue)
  // 请求调度
  requestHostCallback()
}

function requestHostCallback() {
  port.postMessage(null)
}

const channel = new MessageChannel()
const port = channel.port2

channel.port1.onmessage = function() {
  workLoop()
}

function workLoop() {
  let currentTask = peek(taskQueue)
  while (currentTask) {
    const callback = currentTask.callback
    currentTask.callback = null // 防止重复执行
    callback()
    pop(taskQueue)
    currentTask = peek(taskQueue)
  }
}

export function getCurrentTime() {
  return performance.now()
}