const isValid = require('../index')
describe('bracket test', () => {
  test('isValid', () => {
    expect(isValid(['(', ')', '{', '}', '[', ']'])).toBe(true)
  })
  test('isValid2', () => {
    expect(isValid([['(', '{', '}', '[', ']']])).toBe(false)
  })
})