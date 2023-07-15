// hint signs where to start
exports.GallopRight = function(sortState, key, run, length, hint) {
  const workArray = sortState.workArray
  const baseHintElement = workArray[run + hint]
  let order = sortState.Compare(key, baseHintElement)
  let lastOffset = 0, offset = 1
  if (order < 0) {
    const maxOffset = hint + 1
    while (offset < maxOffset) {
      const offsetElement = workArray[run + hint - offset]
      order = sortState.Compare(key, offsetElement)
      if (order >= 0) break
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset
    const tmp = lastOffset
    lastOffset = hint - offset
    offset = hint - tmp
  } else {
    const maxOffset = length - hint
    while (offset < maxOffset) {
      const offsetElement = workArray[run + hint + offset]
      order = sortState.Compare(key, offsetElement)
      if (order < 0) break
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset
    lastOffset += hint
    offset += hint
  }
  lastOffset++
  while (lastOffset < offset) {
    const m = lastOffset + (offset - lastOffset >> 1)
    order = sortState.Compare(key, workArray[run + m])
    if (order < 0) {
      offset = m
    } else {
      lastOffset = m + 1
    }
  }
  return offset
}

exports.GallopLeft = function(sortState, key, run, length, hint) {
  const workArray = sortState.workArray
  let lastOffset = 0, offset = 1
  const baseHintElement = workArray[run + hint]
  let order = sortState.Compare(baseHintElement, key)
  if (order < 0) {
    const maxOffset = length - hint
    while (offset < maxOffset) {
      const offsetElement = workArray[run + hint + offset]
      order = sortState.Compare(offsetElement, key)
      if (order >= 0) break
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset
    lastOffset += hint
    offset += hint
  } else {
    const maxOffset = hint + 1
    while (offset < maxOffset) {
      const offsetElement = workArray[run + hint - offset]
      order = sortState.Compare(offsetElement, key)
      if (order < 0) break
      lastOffset = offset
      offset = (offset << 1) + 1
    }
    if (offset > maxOffset) offset = maxOffset
    const tmp = lastOffset
    lastOffset = hint - offset
    offset = hint - tmp
  }
  lastOffset++
  while (lastOffset < offset) {
    const m = lastOffset + (offset - lastOffset >> 1)
    order = sortState.Compare(key, workArray[run + m])
    if (order > 0) {
      offset = m
    } else {
      lastOffset = m + 1
    }
  }
  return offset
}


