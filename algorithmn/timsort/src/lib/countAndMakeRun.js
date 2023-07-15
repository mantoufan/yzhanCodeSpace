exports.CountAndMakeRun = function(sortState, lowArg, high) {
  const low = lowArg + 1
  if (low === high) return 1
  let runLength = 2
  const workArray = sortState.workArray
  // Using front 2 elements to judge if it's in decreasing order
  const elementLow = workArray[low]
  const elementLowPre = workArray[low - 1]
  let order = sortState.Compare(elementLow, elementLowPre)
  const isDescending = order < 0
  let previousElement = elementLow
  for (let i = low + 1; i < high; i++) {
    const currentElement = workArray[i]
    order = sortState.Compare(currentElement, previousElement)
    if (isDescending) {
      if (order >= 0) break
    } else {
      if (order <= 0) break
    }
    previousElement = currentElement
    runLength++
  }

  // If we get a strict descending sequence, we need to reverse the array
  if (isDescending) {
    ReverseRange(workArray, lowArg, lowArg + runLength)
  }

  return runLength
}

// Reverse the array base on the index
function ReverseRange(array, from, to) {
  let low = from, high = to - 1
  while (low < high) {
    const temp = array[low]
    array[low] = array[high]
    array[high] = temp
    low++
    high--
  }
}