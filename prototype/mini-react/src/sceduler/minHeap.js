// 返回最小堆堆顶元素
export function peek(heap) {
  return heap.size === 0 ? null : heap[0]
}
// 向最小堆中插入元素
// 1. 将 node 插入数组尾部
// 2. 向上调整最小堆
export function push(heap, node) {
  heap.push(node)
  shiftUp(heap, heap.length - 1)
}

// 上浮
function shiftUp(heap, i) {
  let index = i
  const node = heap[index]
  while (index > 0) {
    const parentIndex = index - 1 >> 1
    const parent = heap[parentIndex]
    if (compare(parent, node) > 0) {
      // swap
      heap[parentIndex] = node
      heap[index] = parent
      index = parentIndex
    } else {
      return
    }
  }
}

// 删除堆顶元素
// 1. 最后一个元素覆盖堆顶
// 2. 下浮
export function pop(heap) {
  if (heap.length === 0) return null
  const first = heap[0]
  const last = heap.pop()
  if (first !== last) { // 这里是 Object，可以用等号判断
    heap[0] = last
    shiftDown(heap, 0)
  } 
  return first
}

// 下浮
function shiftDown(heap, i) {
  const n = heap.length
  const halfN = n >> 1
  let index = i
  const node = heap[index]
  while (index < halfN) {
    const leftIndex = (index << 1) + 1
    const rightIndex = (index << 1) + 2
    const left = heap[leftIndex]
    const right = heap[rightIndex]
    if (compare(left, node) < 0) {
      if (rightIndex < n && compare(right, left) < 0) {
        heap[rightIndex] = node
        heap[index] = right
        index = rightIndex
      } else {
        heap[leftIndex] = node
        heap[index] = left
        index = leftIndex
      }
    } else if (rightIndex < n && compare(right, node) < 0) {
      heap[rightIndex] = node
      heap[index] = right
      index = rightIndex
    } else {
      return
    }
  }
}

function compare(a, b) {
  // for test
  // return a - b
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}

// test case
// const ar = [3, 7, 4, 10, 12, 9, 6, 15, 14]
// const heap = []
// while (ar.length) {
//   push(heap, ar.pop())
// }
// while (heap.length) {
//   console.log(pop(heap))
// }
