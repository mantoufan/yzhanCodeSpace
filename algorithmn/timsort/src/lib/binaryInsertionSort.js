exports.BinaryInsertionSort = function(sortState, low, startArg, high) {
  const workArray = sortState.workArray
  let start = low === startArg ? startArg + 1 : startArg
  for(; start < high; start++) {
    let left = low, right = start
    const pivot = workArray[right]
    while (left < right) {
      const mid = left + (right - left >> 1)
      const order = sortState.Compare(pivot, workArray[mid])
      if (order < 0) {
        // left
        right = mid
      } else {
        // right
        left = mid + 1
      }
    }
    for (let i = start; i > left; i--) {
      workArray[i] = workArray[i - 1]
    }
    workArray[left] = pivot
  }
}