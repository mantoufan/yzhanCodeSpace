// vdom 虚拟dom
// old 老节点
// new 新节点
// old array  a b c d e f g
// new array  a b e c d h f g

// mountElement 新增元素 h
// patch  复用元素 a b c d e f g
// unmount 删除元素
// todo
// move 元素移动 ?

exports.diffArray = (c1, c2, { mountElement, patch, unmount, move }) => {
  function isSameVnodeType(n1, n2) {
    return n1.key === n2.key; // && n1.type === n2.type;
  }

  let i = 0
  
  const l1 = c1.length
  const l2 = c2.length

  let e1 = l1 - 1
  let e2 = l2 - 1

  // 1. Traverse from left to right, if the node could be duplicated, so reuse it, else stop traversal.
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = c2[i]
    if (isSameVnodeType(n1, n2)) {
      patch(n1.key)
    } else {
      break
    }
    i++
  }

  // 2. Traverse from right to left, if the node could be duplicated, so reuse it, else stop traversal.
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = c2[e2]
    if (isSameVnodeType(n1, n2)) {
      patch(n1.key)
    } else {
      break
    }
    e1--
    e2--
  }

  // 3. old node not exists, new node exists, create new node
  if (i > e1) {
    if (i <= e2) {
      while (i <= e2) {
        mountElement(c2[i].key)
        i++
      }
    }
  }
  
  // 4. old node exists, new node not exists, remove old node
  else if (i > e2) {
    if (i <= e1) {
      while (i <= e1) {
        unmount(c1[i].key)
        i++
      }
    }
  }

  // 5. old node exists, new node exists
  else {
    // Put new nodes into Map, key: value(index)
    const s1 = i
    const s2 = i
    const keyToNewIndexMap = new Map()
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i]
      keyToNewIndexMap.set(nextChild.key, i)
    }

    // Add new nodes or update old nodes
    const toBePatched = e2 - s2 + 1

    // Map from new index to old index
    const newIndexToOldIndexMap = new Array(toBePatched).fill(-1)

    let patched = 0

    // Traverse old nodes
    let moved = false, maxNewIndexSoFar = 0

    for (let i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      if (patched >= toBePatched) {
        unmount(prevChild.key)
        continue
      }

      const newIndex = keyToNewIndexMap.get(prevChild.key)

      if (newIndex === void 0) {
        // nodes could not be reused
        unmount(prevChild.key)
      } else {
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          // relative position has changed
          moved = true
        }

        newIndexToOldIndexMap[newIndex - s2] = i
        patch(prevChild.key)
        patched++
      }
    }

    // move mount
    const maxIncreasingSequence = moved ? getSequence(newIndexToOldIndexMap) : []
    let lastIndex = maxIncreasingSequence.length - 1

    for (let i = toBePatched - 1; i >= 0; i--) {
      const nextChild = c2[s2 + i]

      // Judge whether to mount
      if (newIndexToOldIndexMap[i] === -1) {
        mountElement(nextChild.key)
      } else {
        if (lastIndex < 0 || i !== maxIncreasingSequence[lastIndex]) {
          move(nextChild.key)
        } else {
          lastIndex--
        }
      }
    }
  }

  function getSequence(arr) {
    // return [1, 2]

    // return path of LIS
    const lis = [0]
    const len = arr.length
    const record = arr.slice()
    for (let i = 0; i < len; i++) {
      const arrI = arr[i]
      if (arrI === -1) continue
      const last = lis[lis.length - 1]
      if (arr[last] < arrI) {
        // the new one is bigger than the last one, insert directly
        record[i] = last
        lis.push(i)
        continue
      }
      // binary insert
      let l = 0, r = lis.length - 1
      while (l <= r) {
        const m = l + ((r - l) >> 1)
        if (arr[lis[m]] > arrI) {
          r = m - 1
        } else {
          l = m + 1
        }
      }
      if (arrI < arr[lis[l]]) {
        if (l > 0) {
          record[i] = lis[l - 1]
        }
        lis[l] = i
      }
    }
    let last = lis[lis.length - 1]
    for (let i = lis.length - 1; i >= 0; i--) {
      lis[i] = last
      last = record[last]
    }
    return lis
  }
};
