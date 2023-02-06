const main = require('../index.js')
describe('覆盖率 Demo', () => {
  test('Test main', () => {
    main(true, true);
  })
  test('Test main', () => {
    main(true);
  })
})