function isString(str) {
  return /^('([^'\n\r\\]|\\'){0,}'|"([^"\n\r]|\\"){0,}")$/.test(str)
}
const cases = [
 [`''`, true],
 [`'"'`, true],
 [`'''`, false],
 [`"""`, false],
 [`\n`, false],
 [`\r`, false],
 [`'\\''`, true],
 [`"\\""`, true],
]
for (const c of cases) {
  console.log(c[0].padEnd(10, ' '), ':', (t = isString(c[0])) === c[1] ? '\x1b[32mpassed\x1b[39m' : '\x1b[31mfailed\x1b[39m', 'expected', c[1], 'got', t)
}