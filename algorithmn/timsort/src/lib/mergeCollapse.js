const { GetPendingRunLength, GetPendingRunBase, SetPendingRunBase, SetPendingRunLength, Copy } = require('./utils')
const { GallopLeft, GallopRight } = require('./gallop')
const KMinGallopWins = 7

function RunInvariantEstablished(pendingRuns, n) {
  if (n < 2) return true
  const runLengthN = GetPendingRunLength(pendingRuns, n)
  const runLengthNM = GetPendingRunLength(pendingRuns, n - 1)
  const runLengthNMM = GetPendingRunLength(pendingRuns, n - 2)
  return runLengthNMM > runLengthNM + runLengthN
}

// Merage partitions i with i + 1
// Merage two increasing partitions
function MergeAt(sortState, i) {
  const workArray = sortState.workArray
  const pendingRuns = sortState.pendingRuns
  let runA = GetPendingRunBase(pendingRuns, i)
  let lengthA = GetPendingRunLength(pendingRuns, i)
  let runB = GetPendingRunBase(pendingRuns, i + 1)
  let lengthB = GetPendingRunLength(pendingRuns, i + 1)

  SetPendingRunLength(pendingRuns, i, lengthA + lengthB)

  if (i === sortState.pendingRunsSize - 3) {
    // If i is the third-to-last parition
    // Then we merge the third-to-last and the second-to-last partition
    // Move the last partition to second-to-last partition
    const lastRun = GetPendingRunBase(pendingRuns, i + 2)
    const lastRunLength = GetPendingRunLength(pendingRuns, i + 2)

    SetPendingRunBase(pendingRuns, i + 1, lastRun)
    SetPendingRunLength(pendingRuns, i + 1, lastRunLength)
  }

  sortState.pendingRunsSize--

  const keyRight = workArray[runB]
  // array[run + offset - 1] <= key < array[run + offset]
  const k = GallopRight(sortState, keyRight, runA, lengthA, 0)
  runA += k
  lengthA -= k

  if (lengthA === 0) return

  const keyLeft = workArray[runA + lengthA - 1]
  // array[run + offset - 1] < key <= array[run + offset]

  lengthB = GallopLeft(sortState, keyLeft, runB, lengthB, lengthB - 1)
  if (lengthB === 0) return
  if (lengthA >= lengthB) {
    MergeHigh(sortState, runA, lengthA, runB, lengthB)
  } else {
    MergeLow(sortState, runA, lengthA, runB, lengthB)
  }
}

function MergeHigh(sortState, runA, lengthA, runB, lengthB) { 
  const workArray = sortState.workArray
  const tempArray = new Array(lengthB)
  Copy(workArray, runB, tempArray, 0, lengthB)

  let dest = runB + lengthB - 1
  let cursorA = runA + lengthA - 1
  let cursorTemp = lengthB - 1
  workArray[dest--] = workArray[cursorA--]
  if (--lengthA === 0) {
    Succeed()
    return
  }
  if (lengthB === 0) {
    CopyA()
  }

  let minGallop = sortState.minGallop
  while (1) {
    let numOfWinsA = 0, numOfWinsB = 0
    while (1) {
      const order = sortState.Compare(tempArray[cursorTemp], workArray[cursorA])
      if (order < 0) {
        workArray[dest--] = workArray[cursorA--]
        numOfWinsA++
        lengthA--
        numOfWinsB = 0
        if (lengthA === 0) {
          Succeed()
          return
        }
        if (numOfWinsA >= minGallop) break
      } else {
        workArray[dest--] = tempArray[cursorTemp--]
        numOfWinsB++
        lengthB--
        numOfWinsA = 0
        if (lengthB === 1) {
          CopyA()
          return
        }
        if (numOfWinsB >= minGallop) break
      }
    }
    minGallop++
    do {
      minGallop = Math.max(1, minGallop - 1)
      sortState.minGallop = minGallop

      let k = GallopRight(sortState, workArray, tempArray[cursorTemp], runA, lengthA, lengthA - 1)
      numOfWinsA = lengthA - k
      if (numOfWinsA > 0) {
        dest -= numOfWinsA
        cursorA -= numOfWinsA
        Copy(workArray, cursorA + 1, workArray, dest + 1, numOfWinsA)
        lengthA -= numOfWinsA
        if (lengthA === 0) {
          Succeed()
          return
        }
      }
      workArray[dest--] = tempArray[cursorTemp--]
      if (--lengthB === 1) {
        CopyA()
        return
      }

      k = GallopLeft(sortState, tempArray, workArray[cursorA], 0, lengthB, lengthB - 1)
      numOfWinsB = lengthB - k
      if (numOfWinsB > 0) {
        dest -= numOfWinsB
        cursorTemp -= numOfWinsB
        Copy(tempArray, cursorTemp + 1, workArray, dest + 1, numOfWinsB)

        lengthB -= numOfWinsB
        if (lengthB === 1) {
          CopyA()
          return
        }
        if (lengthB === 0) return
      }
      workArray[dest--] = workArray[cursorA--]
      if (--lengthA === 0) {
        Succeed()
        return
      }
    } while (numOfWinsA >= KMinGallopWins || numOfWinsB >= KMinGallopWins) 

    minGallop++
    sortState.minGallop = minGallop
  }

  function Succeed() {
    if (lengthB > 0) {
      Copy(tempArray, 0, workArray, dest - lengthB + 1, lengthB)
    }
  }
  function CopyA() {
    dest -= lengthA
    cursorA -= lengthA
    Copy(workArray, cursorA + 1, workArray, dest + 1, lengthA)
    workArray[dest] = tempArray[cursorTemp]
  }
}

function MergeLow(sortState, runA, lengthA, runB, lengthB) {
  const workArray = sortState.workArray
  const tempArray = new Array(lengthA)
  let cursorTemp = 0
  let dest = runA
  let cursorB = runB

  Copy(workArray, runA, tempArray, 0, lengthA)

  workArray[dest++] = workArray[cursorB++]

  if (--lengthB === 0) {
    Succeed()
    return
  }

  if (lengthA === 1) {
    CopyB()
    return
  }

  let minGallop = sortState.minGallop
  while (1) {
    let numOfWinsA = 0, numOfWinsB = 0
    while (1) {
      const order = sortState.Compare(workArray[cursorB], tempArray[cursorTemp])
      if (order < 0) {
        workArray[dest++] = workArray[cursorB++]
        numOfWinsB++
        lengthB--
        numOfWinsA = 0
        if (lengthB === 0) {
          Succeed()
          return
        }
        if (numOfWinsB >= minGallop) break
      } else {
        workArray[dest++] = tempArray[cursorTemp++]
        numOfWinsA++
        lengthA--
        numOfWinsB = 0
        if (lengthA === 1) {
          CopyB()
          return
        }
        if (numOfWinsA >= minGallop) break
      }
    }
    minGallop++
    do {
      minGallop = Math.max(1, minGallop - 1)
      sortState.minGallop = minGallop
      numOfWinsA = GallopRight(sortState, tempArray, workArray[cursorB], cursorTemp, lengthA, 0)
      if(numOfWinsA > 0) {
        Copy(tempArray, cursorTemp, workArray, dest, numOfWinsA)
        dest += numOfWinsA
        cursorTemp += numOfWinsA
        lengthA -= numOfWinsA
        if (lengthA === 1) {
          CopyB()
          return
        }
        if (lengthA === 0) return
      }

      workArray[dest++] = workArray[cursorB++]
      if (--lengthB === 1) {
        Succeed()
        return
      }
      numOfWinsB = GallopLeft(sortState, workArray, tempArray[cursorTemp], cursorB, lengthB, 0)
      if (numOfWinsB > 0) {
        Copy(workArray, cursorB, workArray, dest, numOfWinsB)
        dest += numOfWinsB
        cursorB += numOfWinsB
        lengthB -= numOfWinsB
        if (lengthB === 0) {
          Succeed()
          return
        }
      }
      workArray[dest++] = tempArray[cursorTemp++]
      if (--lengthA === 1) {
        CopyB()
        return
      }
      
    } while (numOfWinsA >= KMinGallopWins || numOfWinsB >= KMinGallopWins) 

    minGallop++
    sortState.minGallop = minGallop
  }

  function Succeed() {
    if (lengthA > 0) {
      Copy(tempArray, cursorTemp, workArray, dest, lengthA)
    }
  }

  function CopyB() {
    if (lengthA === 1 && lengthB > 0) {
      Copy(workArray, cursorB, workArray, dest, lengthB)
      workArray[dest + lengthB] = tempArray[cursorTemp]
    }
  }
}

exports.MergeCollapse = function(sortState) {
  const pendingRuns = sortState.pendingRuns
  while (sortState.pendingRunsSize > 1) {
    let n = sortState.pendingRunsSize - 2
    if (RunInvariantEstablished(pendingRuns, n + 1) === false || RunInvariantEstablished(pendingRuns, n) === false) {
      if (GetPendingRunLength(pendingRuns, n - 1) < GetPendingRunLength(pendingRuns, n + 1)) n--
      MergeAt(sortState, n)
    } else if (
      GetPendingRunLength(pendingRuns, n) <= GetPendingRunLength(pendingRuns, n + 1)
    ) {
      MergeAt(sortState, n)
    } else {
      break
    }
  }
}

exports.MergeForceCollapse = function(sortState) {
  while (sortState.pendingRunsSize > 1) {
    let n = sortState.pendingRunsSize - 2
    while (n > 0 && GetPendingRunLength(sortState.pendingRuns, n - 1) < GetPendingRunLength(sortState.pendingRuns, n + 1)) n--
    MergeAt(sortState, n)
  }
}