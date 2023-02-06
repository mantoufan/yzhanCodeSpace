const add = require('../add')
// 测试单元
describe('测试 Add 函数', () => {
  // 测试用例
  test('add(1,2) === 3', () => {
    // 断言
    expect(add(1, 2)).toBe(3);
  })
  test('add(2,2 === 4', () => {
    expect(add(2, 2)).toBe(4);
  })
})