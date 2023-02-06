const walk = require('../walk')
describe('测试 walk 函数', () => {
  it('单节点', () => {
    const ast = {
      a: [
        {
          b: 2
        }
      ]
    }
    const enter = jest.fn()
    const leave = jest.fn()
    walk(ast, { enter, leave })
    // 期待：进入节点时调用 enter
    let calls = enter.mock.calls // 调用结果
    expect(calls.length).toBe(3)
    // calls[0] 第一次调用的参数
    expect(calls[0][0]).toEqual({a: [{b: 2}]})
    expect(calls[1][0]).toEqual([{b: 2}])
    expect(calls[2][0]).toEqual({b: 2})

    // 期待：离开节点时调用 leave
    calls = leave.mock.calls
    expect(calls.length).toBe(3)
    expect(calls[0][0]).toEqual({b: 2})
    expect(calls[1][0]).toEqual([{b: 2}])
    expect(calls[2][0]).toEqual({a: [{b: 2}]})
  })

  it('多节点', () => {
    const ast = {
      a:{
        b: 1
      },
      c: {
        d: 2
      }
    }
    const enter = jest.fn()
    const leave = jest.fn()
    walk(ast, { enter, leave })
    // 期待：进入节点时调用 enter
    let calls = enter.mock.calls // 调用结果
    expect(calls.length).toBe(3)
    // calls[0] 第一次调用的参数
    expect(calls[0][0]).toEqual({a:{b: 1},c: {d: 2}})
    expect(calls[1][0]).toEqual({b: 1})
    expect(calls[2][0]).toEqual({d: 2})

    // 期待：离开节点时调用 leave
    calls = leave.mock.calls
    expect(calls.length).toBe(3)
    expect(calls[0][0]).toEqual({b: 1})
    expect(calls[1][0]).toEqual({d: 2})
    expect(calls[2][0]).toEqual({a:{b: 1},c: {d: 2}})
  })
})