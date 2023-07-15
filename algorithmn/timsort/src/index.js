const { ArrayTimSortImpl } = require('./lib/arrayTimSortImpl')

exports.TimSort = (array, compare = (a, b) => a - b) => {
  const sortState = {
    workArray: array,
    Compare: compare,
    tempArray: [],
    pendingRunsSize: 0, // paritions quantity
    pendingRuns: [], // partitions information stack
    minGallop: 7,
    KMinGallopWins: 7
  }
  ArrayTimSortImpl(sortState)
  
  // 返回有序数组
  return sortState.workArray
}