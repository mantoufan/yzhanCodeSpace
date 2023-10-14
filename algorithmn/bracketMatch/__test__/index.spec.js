const { isBracketMatch } = require('../index')
describe("bracketMatch", () => {
  it("should return true", () => {
    [
      ['()', true],
      ['[]', true],
      ['{}', true],
      ['()[]{}', true],
    ].forEach(([str, expected]) => {
      expect(isBracketMatch(str)).toBe(expected)
    })
  })
})