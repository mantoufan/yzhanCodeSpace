import { strStrByBruteForce, strStrByKMP } from './index'
describe('test strStr', () => {
  const inputs = [
    ["aabc", "aab"],
    ["hello", 'll'],,
    ['a', 'a'],
    ["mississippi", "issip"]
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
})