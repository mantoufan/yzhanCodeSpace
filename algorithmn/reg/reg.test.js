import { strstrBF, strstrDoublePoint } from './reg';
describe('strstr', () => {
  it('strstrBF', () => {
    expect(strstrBF('abababc', 'ababc')).toBe(2)
    expect(strstrBF('abababc', 'd')).toBe(-1)
  })
  it('strstrDoublePoint', () => {
    expect(strstrDoublePoint('abababc', 'ababc')).toBe(0)
    expect(strstrDoublePoint('abababc', 'd')).toBe(-1)
  })
  // it('strstrKMP', () => {
  //   expect(strstrKMP('abababc', 'ababc')).toBe(0)
  //   expect(strstrkMP('abababc', 'd')).toBe(-1)
  // })
});