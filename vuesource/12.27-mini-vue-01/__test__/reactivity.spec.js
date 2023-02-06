import { reactive } from "../src/reactivity/reactive";
import { effect } from "../src/reactivity/effect";

describe('reactivity', () => {
  test('reactive() ', () => {
    const original = {foo: 'foo'}
    const observed = reactive(original)
    observed.foo = 'foo~~~'
    expect(original.foo).toBe('foo~~~')
  });

  it('effect', () => {
    let dummy
    const counter = reactive({ num: 0 })
    const fnSpy = jest.fn(() => {
      dummy = counter.num
    })
    effect(fnSpy)
  
    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(0)
    
    counter.num = 1
    expect(fnSpy).toHaveBeenCalledTimes(2)
    expect(dummy).toBe(1)
  })

  it('should observe multiple properties', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))
  
    expect(dummy).toBe(0)
    counter.num1 = counter.num2 = 7
    expect(dummy).toBe(21)
  })
  
  it('should handle multiple effects', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => (dummy1 = counter.num))
    effect(() => (dummy2 = counter.num))
  
    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num++
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
  })

  it('effect should linked to the exact key', () => {
    const observe = reactive({ foo: 'foo', bar: 'bar' })
    const fnSpy = jest.fn(() => {
      observe.foo
    });
  
    effect(fnSpy)
    observe.bar = 'barrr'
    observe.foo = 'foooo'
    expect(fnSpy).toHaveBeenCalledTimes(2)
  });

  it("调度执行", () => {
    const obj = reactive({ foo: 1 });
    const arr = [];
    jest.useFakeTimers(); // 开启模拟定时器
    effect(() => arr.push(obj.foo), {
      scheduler(fn) {
        setTimeout(fn);
      },
    });
    obj.foo++;
    arr.push("over");
  
    jest.runAllTimers(); // 等待所有定时器执行
    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe("over");
    expect(arr[2]).toBe(2);
  });
  
  it("should be nested", () => {
    const obj = reactive({ foo: "foo", bar: "bar" });
    const arr = []
    const mockFn1 = jest.fn(() => {
      arr.push(obj.bar)
    });
    const mockFn2 = jest.fn(() => {
      // mockFn1嵌套在mockFn2内部，obj.bar -> mockFn1
      effect(mockFn1);
      arr.push(obj.foo)
    });
    // mockFn2包含了mockFn1，obj.foo -> mockFn2
    effect(mockFn2)
    // 因此希望内部mockFn1先执行，arr[0]是bar，arr[1]是foo
    expect(arr[0]).toBe('bar')
    expect(arr[1]).toBe('foo')
    // 修改foo，希望触发mockFn2，再次添加obj.foo
    obj.foo = "fooooo";
    expect(arr[3]).toBe('fooooo');
  });
});