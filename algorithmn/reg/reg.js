// O(m * n)
export function strstrBF(source, pattern) {
  const n = source.length, m = pattern.length
  label: for (let i = 0; i <= n - m; i++) {
    for (let j = 0; j < m; j++) {
      if (source[i + j] !== pattern[j]) continue label
    }
    return i
  }
  return -1
}
// O(m * n)
export function strstrDoublePoint(source, pattern) {
  const n = source.length, m = pattern.length
  for (let i = 0; i < n; i++) {
    if (j > 0 && source[i] !== pattern[j]) j = 0
    if (source[i] === pattern[j]) j++
    if (i === m) return j
  }
  return -1
}
// O(m + n)
export function strstrKmp(source, pattern) {
  const n = source.length, m = pattern.length
  
}