const acorn = require('acorn')
const MagicString = require('magic-string')
function getCode(code) {
  const ast = acorn.parse(code, {
    locations: true,
    ranges: true,
    sourceType: 'module',
    ecmaVersion: 7
  })
  return {
    ast,
    magicString: new MagicString(code)
  }
}
module.exports = getCode