const Bundle = require('../bundle')
const fs = require('fs')
jest.mock('fs')
describe('测试 Bundle', () => {
  it('fetch Module', () => {
    const bundle = new Bundle({ entry: './a.js' })
    // fs.readFileSync
    fs.readFileSync.mockReturnValueOnce('const a = 1;')
    const module = bundle.fetchModule('index.js')
    const { calls } = fs.readFileSync.mock
    expect(calls[0][0]).toBe('index.js')
    expect(module.magicString.toString()).toBe('const a = 1;')
  })
  describe('build', () => {
    it('单条语句', () => {
      const bundle = new Bundle({ entry: './a.js' })
      // fs.readFileSync
      fs.readFileSync.mockReturnValueOnce('console.log(1)')
      bundle.build('bundle.js')
      const { calls } = fs.writeFileSync.mock
      expect(calls[0][0]).toBe('bundle.js')
      expect(calls[0][1]).toBe('console.log(1)')
    })
    it('多条语句', () => {
      const bundle = new Bundle({ entry: './a.js' })
      // fs.readFileSync
      fs.readFileSync.mockReturnValueOnce(`const a = () => 1;
      const b = () => 2;
      a()`)
      fs.writeFileSync.mock.calls = [] // 因为前面测试用例用过 calls ，这里清空
      bundle.build('bundle.js')
      
      const { calls } = fs.writeFileSync.mock
      expect(calls[0][0]).toBe('bundle.js')
      expect(calls[0][1]).toBe(`const a = () => 1;
a()`)
    })
    it('多模块', () => {
      const bundle = new Bundle({ entry: './a.js' })
      // fs.readFileSync
      fs.readFileSync.mockReturnValueOnce(`import a from './a';
      a()`) // 准备加载 a 模块
      .mockReturnValueOnce('export const a = () => 1;')

      fs.writeFileSync.mock.calls = [] // 因为前面测试用例用过 calls ，这里清空
      bundle.build('bundle.js')
      
      const { calls } = fs.writeFileSync.mock
      expect(calls[0][0]).toBe('bundle.js')
      expect(calls[0][1]).toBe(`const a = () => 1;
a()`)
    })
  })
})