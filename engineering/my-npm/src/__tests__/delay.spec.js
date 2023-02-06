const delay = require('../delay')

it('异步测试', done => {
  jest.useFakeTimers()
  delay(() => {
    done()
  })
  jest.runAllTimers()
  expect(true).toBe(true)
})

it('感知函数是否被调用', done => {
  const mockFn = jest.fn()
  jest.useFakeTimers()
  delay(() => {
    mockFn(1)
    mockFn(2)
    done()
  })
  jest.runAllTimers()
  expect(true).toBe(true)
  expect(mockFn).toBeCalled()
  expect(mockFn).toBeCalledTimes(2)
  expect(mockFn).toBeCalledWith(1)
  expect(mockFn).toBeCalledWith(2)
})