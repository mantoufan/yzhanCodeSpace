const { getData } = require('../fetch')
const axios = require('axios')
// 模拟谁：对象名
jest.mock('axios')
it('测试 fetch', async () => {
  // 定义对象的行为
  axios.get.mockResolvedValueOnce('123')
  axios.get.mockResolvedValueOnce('456')
  const data1 = await getData()
  const data2 = await getData()
  expect(data1).toBe('123')
  expect(data2).toBe('456')
})