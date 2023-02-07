import { reactive } from '../index';
it('reactive should work', () => {
  const original = { foo: 'foo' }
  const observed = reactive(original)
  // 代理对象是全新对象
  expect(observed).not.toBe(original)
  // 能够访问所代理对象的属性
  expect(observed.foo).toBe(original.foo)
  // 能够修改所代理对象的属性
  observed.foo = 'foooooo~'
  expect(original.foo).toBe(observed.foo)
  // 能够新增所代理对象的属性
  observed.bar = 'bar'
  expect(original.bar).toBe(observed.bar)
  // 能够删除所代理对象的睡醒
  delete observed.bar
  expect(original.bar).toBe(void 0)
})