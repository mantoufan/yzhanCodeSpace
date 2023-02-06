const { generateDiv } = require('../dom')
require('../jsdom-config')
it('Dom 的快照测试', () => {
  generateDiv()
  expect(document.getElementsByClassName('c2')).toMatchSnapshot()
})