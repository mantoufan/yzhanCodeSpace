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
export const strStrByKMP = (haystack, needle) => {
  const m = needle.length, next = new Uint32Array(m)
  for (let i = 1, j = 0; i < m; i++) {
    while (j > 0 && needle[i] !== needle[j]) j = next[j - 1]
    if (needle[i] === needle[j]) j++
    next[i] = j
  }
  const n = haystack.length
  for (let i = 0, j = 0; i < n; i++) {
    while (j > 0 && haystack[i] !== needle[j]) j = next[j - 1]
    if (haystack[i] === needle[j]) j++
    if (j === m) return i - j + 1
  }
  return -1
}