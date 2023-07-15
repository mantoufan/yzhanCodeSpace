const { PushRun } = require('./pushRun')
const { BinaryInsertionSort } = require('./binaryInsertionSort')
const { ComputeMinRunLength } = require('./computeMinRunLength')
const { CountAndMakeRun } = require('./countAndMakeRun')
const { MergeCollapse, MergeForceCollapse } = require('./mergeCollapse')

function ArrayTimSortImpl(sortState) {
  const n = sortState.workArray.length
  if (n <= 1) return
  // Traverse the array, find partitions, merge them
  let low = 0
  // How many left items in the array
  let remaining = n
  // Calculate the min run length
  const minRunLength = ComputeMinRunLength(remaining)
  while (remaining > 0) {
    let currentRunLength = CountAndMakeRun(sortState, low, low + remaining)
    if (currentRunLength < minRunLength) {
      // Expand the partition
      const foreceRunLength = Math.min(minRunLength, remaining)
      BinaryInsertionSort(
        sortState, 
        low, 
        low + currentRunLength, 
        low + foreceRunLength
      )
      currentRunLength = foreceRunLength
    }
    // Add the partition to the stack
    PushRun(sortState, low, currentRunLength)

    // Merge the partitions
    MergeCollapse(sortState)

    // Find the next partition
    low += currentRunLength
    remaining -= currentRunLength
  }
  // Merge all the partitions in stack, until there is only on left partition
  MergeForceCollapse(sortState)
}

exports.ArrayTimSortImpl = ArrayTimSortImpl