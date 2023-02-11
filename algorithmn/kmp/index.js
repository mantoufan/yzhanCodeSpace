export const strStrByBruteForce = (haystack, needle) => {
  const n = haystack.length, m = needle.length
  for (let i = 0; i < n; i++) {
    let isFound = true
    for (let j = 0; j < m; j++) {
      if (haystack[i + j] !== needle[j]) {
        isFound = false
        break
      }
    }
    if (isFound) return i
  }
  return -1
}
export const strStrByKMP = (source, pattern) => {
  const n = source.length, m = pattern.length
  const next = getNext(pattern)
  let i = 0, j = 0
  while (i < n) {
    if (source[i] === pattern[j]) {
      j++
      i++
    } else if (j === 0) {
      i++
    } else {
      j = next[j]
    }
    if (j === m) return i - j
  }
  return -1
}
export const strStrByStateMachine = (source, pattern) => {
  return check(source, pattern)
}
/**
  * Get next array
  * case: j = 0
    ababcababab
j: 5     ababcababab     j = 0
j: 0         ababcababab next[i] = 1
   000120123412
    case: j = next[j]
    ababcababab
j: 5     ababcababab     j = next[j]
j: 2       ababcababab   next[i] = 3 
   000120123434
*/
const getNext = pattern => {
  const m = pattern.length
  const next = new Uint32Array(m)
  let i = 1, j = 0
  while (i < m) {
    if (pattern[i] === pattern[j]) {
      j++
      i++
      next[i] = j
    } else if (j === 0) {
      i++
      next[i] = j
    } else {
      j = next[j]
    }
  }
  return next
}
// State Machine Entrance
export const check = (source, pattern) => {
  // Function factory: Return StateFunction based on Index
  function returnStateFunction (curChar, nextStateIndex, redirectStateIndex) {
    return char => {
      if (char === curChar) return states[nextStateIndex]
      return states[redirectStateIndex](char)
    }
  }

  /* Get next Array from pattern
      ababc
  j:2   ababc    j = next[j]
  j:0     ababc  next[j] = 0
     000120
  */
  const next = getNext(pattern)
  const start = char => {
    if (char === pattern[0]) return states[1]
    return start
  }

  // Build states Array
  const success = () => success
  const states = [start]
  const m = pattern.length
  for (let i = 1; i < m; i++) { // i starts from 1
    states.push(returnStateFunction(pattern[i], i + 1, next[i]))
  }
  states.push(success)

  // Run State Machine
  const n = source.length
  let state = start
  for (let i = 0; i < n; i++) {
    state = state(source[i])
    if (state === success) return i - m + 1
  }
  return -1
}


// const afterA = returnStateFunction('b', afterB, start)
// export const afterA = char => {
//   if (char === 'b') return afterB
//   return start(char)
// }

//const afterB = returnStateFunction('a', afterA2, start)
// export const afterB = char => {
//   if (char === 'a') return afterA2
//   return start(char)
// }

// const afterA2 = returnStateFunction('b', afterB2, afterB)
// export const afterA2 = char => {
//   if (char === 'b') return afterB2
//   return afterB(char)
// }

//const afterB2 = returnStateFunction('c', success, success)
// export const afterB2 = char => {
//   if (char === 'c') return success
//   return success
// }

// export const afterC = char => {
//   if (char === 'd') return afterD
//   return success
// }
// export const afterD = char => {
//   if (char === 'e') return success
// }
