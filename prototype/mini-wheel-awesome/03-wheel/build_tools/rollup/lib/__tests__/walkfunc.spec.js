const travese = require('../walkfunc');
describe('traverse function', () => {
  it('walk function', () => {
    expect(travese(`
    function A() {
      const a = 1
      const b = 1
      function B() {
        const c = 3
        function C() {
          const d = 3
        }
      }
    }`)).toBe(`
====function A====
  a
  b
  ====function B====
    c
    ====function C====
      d
    ====function C====
  ====function B====
====function A====`)
  })
})