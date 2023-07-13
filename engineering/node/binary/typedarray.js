function getBits(n) {
  const ar = []
  while (n) {
    ar.unshift(n & 1)
    n >>= 1
  }
  return ar.join('')
}
  

const buff1 = new Uint8Array(8)
const buff2 = new Uint8Array(buff1.buffer)
buff1[0] = 128
// console.log(buff1, buff2)
const buff3 = new Float64Array(buff1.buffer)
buff3[0] = .1
console.log(buff2.reverse())
const buff2Binary = []
for (let i = 0; i < 8; i++) {
  buff2Binary.push(getBits(buff2[i]).padStart(8, '0'))
}
console.log(buff2Binary.reverse())