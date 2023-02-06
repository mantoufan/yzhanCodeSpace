import { calculate } from '../calculator'

describe('Test expressionParser', () => {
  it('Test structure', () => {
    const str = '2 * 5 * (3 + 4)'
    const list = calculate(str)
    console.log(list)
    expect(list).toEqual(list)
  })
})

// todo 
// 2 ** 3 ** 4 右结合