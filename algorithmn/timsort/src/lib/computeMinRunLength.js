// if n < 64 return n, using binary insertion sort
// else if n is the exponentiation of 2, return 32
// else return k, 32 <= k <= 64
exports.ComputeMinRunLength = function(n) {
  let r = 0
  while (n >= 64) {
    r |= n & 1
    n >>= 1
  }
  return n + r
}