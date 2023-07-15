const { SetPendingRunBase, SetPendingRunLength } = require('./utils')
// low is partition start Index
// length is partition length
exports.PushRun = function(sortState, low, length) {
  const stackSize = sortState.pendingRunsSize
  const pendingRuns = sortState.pendingRuns
  SetPendingRunBase(pendingRuns, stackSize, low)
  SetPendingRunLength(pendingRuns, stackSize, length)
  sortState.pendingRunsSize += 1
}