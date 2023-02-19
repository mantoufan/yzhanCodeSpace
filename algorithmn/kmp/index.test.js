import { strStrByBruteForce, strStrByKMP, strStrByStateMachine } from './index'
describe('test strStr', () => {
  it('Burte Force', () => {
    const start = getTime()
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByBruteForce(haystack, needle)).toBe(haystack.indexOf(needle))
    })
    log('Burte Force', start)
  })
  it('KMP', () => {
    const start = getTime()
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByKMP(haystack, needle)).toBe(haystack.indexOf(needle))
    })
    log('KMP', start)
  })
  it('State Machine', () => {
    const start = getTime()
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByStateMachine(haystack, needle)).toBe(haystack.indexOf(needle))
    })
    log('State Machine', start)
  })
})
const inputs = [
  ['ababcababc', 'ababcababab'],
  ['abcde', 'ababc'],
  ['ababcde', 'ababc'],
  ['ff', 'ababc'],
  ['abababc', 'ababc'],
  ["aabc", "aab"],
  ["hello", 'll'],,
  ['a', 'a'],
  ['mississippi', 'issip']
]
const getTime = () => {
  var hrTime = process.hrtime()
  return hrTime[0] * 1000000 + hrTime[1] / 1000
}
const log = (name, start) => {
  console.log(name + ': run', inputs.length, 'cases in', getTime() - start + 'us')
}