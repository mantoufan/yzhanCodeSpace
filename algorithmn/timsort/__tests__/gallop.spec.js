const { GallopLeft } = require('../src/lib/gallop')
const compare = (a, b) => a - b
it('GallopLeft 31', () => {
  const arr = []
  for (let i = 0; i < 64; i++) {
    arr[i] = i % 32
  }
  const res = GallopLeft({workArray: arr, Compare: compare}, 31, 32, 32, 31)
  expect(res).toBe(31)
})

it('GallopLeft 32', () => {
  const arr = []
  for (let i = 0; i < 64; i++) {
    arr[i] = i % 32
  }
  arr[63] = 30
  const res = GallopLeft({workArray: arr, Compare: compare}, 31, 32, 32, 31)
  expect(res).toBe(32)
})