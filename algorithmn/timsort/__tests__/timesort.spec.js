const { TimSort } = require('../src/index')
describe('数组 Diff', () => {
  const sort = TimSort
  it('Partition only 12345 without considering the actual length', () => {
    const arr = [5, 1, 2, 4, 3]
    const compare = (a, b) => a - b
    const res = sort(arr, compare)
    expect(res).toEqual([1, 2, 3, 4, 5])
  })
  it('Integers 1 - 10', () => {
    const arr = [5, 1, 2, 4, 3, 6, 7, 9, 8, 10]
    const compare = (a, b) => a - b
    const res = sort([...arr], compare)
    expect(res).toEqual(arr.sort(compare))
  })
  it('64 integers using MergeHigh', () => {
    const arr = []
    for (let i = 0; i < 64; i++) {
      arr[i] = i % 32
    }
    arr[32] = -1
    const compare = (a, b) => a - b
    const res = sort(arr, compare)
    expect(res).toBe(arr.sort((a, b) => a - b))
  })

  it('64 integers using MergeLow', () => {
    const arr = []
    for (let i = 0; i < 64; i++) {
      arr[i] = i % 32
    }
    arr[32] = -1
    const compare = (a, b) => a - b
    const res = sort(arr, compare)
    expect(res).toBe(arr.sort((a, b) => a - b))
  })
  it('164 integers', () => {
    const arr = []
    for (let i = 0; i < 164; i++) {
      arr[i] = 1 || (Math.random() * 1000) >> 1
    }
    const compare = (a, b) => a - b
    const res = sort(arr, compare)
    expect(res).toBe(arr.sort((a, b) => a - b))
  })
  it('5000 integers', () => {
    const arr = []
    for (let i = 0; i < 5000; i++) {
      arr[i] = 1 || (Math.random() * 1000 * 5000) >> 1
    }
    const compare = (a, b) => a - b
    const res = sort(arr, compare)
    expect(res).toBe(arr.sort((a, b) => a - b))
  })
})