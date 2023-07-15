/* check if a string is a valid decimal number
<one> ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
<more> ::= ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9') <one> | <more> <one>
<decimal> ::= <one> | <more>
<fractional> ::= <one> | <fractional> <one>
<float64> ::= <decimal> '.' | '.' <fractional> | <decimal> '.' <fractional>
*/
function isDecimalNumber(str) {
  return /^(?:\d|[1-9]\d+)?\.?\d*$/.test(str);
}
const cases =  [
  ['1.1', true],
  ['.1', true],
  ['0.1', true],
  ['00.1', false],
  ['1.', true],
  ['1.0', true]
 ]
for (const c of cases) {
  // console.log(isDecimalNumber(c[0]) === c[1], 'expected', c[1], 'got', isDecimalNumber(c[0]))
}

/* Production:
<one> = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
<more> = ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9') <one> | <more> <one>
<decimal> = <one> | <more>
*/

// Unicode Code Point
// console.log('a'.charCodeAt(0))
// console.log('\u0041'.codePointAt(0))

const regStr = `[0-9]|[1-9][0-9]{1,}
\\.[0-9]{1,}
(?:[0-9]|[1-9][0-9]{1,})\\.
(?:[0-9]|[1-9][0-9]{1,})\\.[0-9]{1,}`
.split('\n')
.map(item=> '(?:' + item + ')').join('|')

const reg = new RegExp('^(' + regStr + ')$')
function isDecimalNumberUsingRegStr(str) {
  return reg.test(str);
}

for (const c of cases) {
  console.log(isDecimalNumberUsingRegStr(c[0]) === c[1], 'expected', c[1], 'got', isDecimalNumber(c[0]))
}

// exec
const regChar = /[a-zA-Z]/g
const str = 'Hello World'

let result = ''
while((result = regChar.exec(str)) !== null) {
  // console.log(regChar.lastIndex)
  // console.log(result)
}
