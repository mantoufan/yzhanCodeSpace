// store partition into stack[run << 1]
// run is current stack size
exports.GetPendingRunBase = function(pendingRuns, run) {
  return pendingRuns[run << 1]
}

exports.SetPendingRunBase = function(pendingRuns, run, value) {
  pendingRuns[run << 1] = value
}

// store partition length into stack[run << 1 + 1]
exports.GetPendingRunLength = function(pendingRuns, run) {
  return pendingRuns[(run << 1) + 1]
}

exports.SetPendingRunLength = function(pendingRuns, run, value) {
  pendingRuns[(run << 1) + 1] = value
}

exports.Copy = function(source, srcPos, target, dstPos, length) {
  if (srcPos < dstPos) {
    let srcIndex = srcPos + length - 1
    let dstIndex = dstPos + length - 1
    while(srcIndex >= srcPos) {
      target[dstIndex--] = source[srcIndex--]
    }
  } else {
    let srcIndex = srcPos
    let dstIndex = dstPos
    const to  = srcIndex + length
    while (srcIndex < to) {
      target[dstIndex++] = source[srcIndex++]
    }
  }
}