const { generateDiv } = require('../dom')
require('../jsdom-config')
it('Dom 测试', () => {
  generateDiv()
  expect(document.querySelector('.c1')).toBeTruthy()
})