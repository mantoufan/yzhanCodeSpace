import { strStrByBruteForce, strStrByKMP, strStrByStateMachine } from './index'
describe('test strStr', () => {
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
  it('Burte Force', () => {
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByBruteForce(haystack, needle)).toBe(haystack.indexOf(needle))
    })
  })
  it('KMP', () => {
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByKMP(haystack, needle)).toBe(haystack.indexOf(needle))
    })
  })
  it('State Machine', () => {
    inputs.forEach(([haystack, needle])  => {
      expect(strStrByStateMachine(haystack, needle)).toBe(haystack.indexOf(needle))
    })
  })
})