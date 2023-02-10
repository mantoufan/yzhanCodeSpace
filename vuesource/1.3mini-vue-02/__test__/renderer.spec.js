import { createRenderer, Text } from "../src/runtime-core"
import { nodeOps } from "../src/runtime-dom"
describe("renderer", () => {
  it('renderer.render', () => {
    const renderer = createRenderer(nodeOps)
    const container = document.createElement('div')
    const vnode = {// <div>hello</div>
      tag: 'div',
      children: 'hello'
    }
    renderer.render(vnode, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  });
  it('render text', () => {
    const renderer = createRenderer(nodeOps)
    const container = document.createElement('div')
    // <div>foo<span>bar</span></div>
    const vnode = {
      tag: Text, // Text是一个Symbol
      children: 'hello'
    }
    renderer.render(vnode, container)
    expect(container.innerHTML).toBe('hello')
  });

  it("render text and element", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: [
        { tag: Text, children: "hello" },
        { tag: "span", children: "vue" },
      ],
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello<span>vue</span></div>");
  });
})
it("set element attributes", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const onClick = jest.fn()
  const vnode = {
    tag: "div",
    props: { id: "box", class: "box", onClick },
    children: "hello",
  };
  renderer.render(vnode, container);
  expect(container.innerHTML).toMatch('<div id="box" class="box">hello</div>');
  const div = container.firstElementChild
  div.dispatchEvent(new Event('click'))
  expect(onClick).toHaveBeenCalledTimes(1);
});
it("render component", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const vnode = {
    tag: {
      template: "<div>component</div>",
    },
  };
  renderer.render(vnode, container);
  expect(container.innerHTML).toBe("<div>component</div>");
});
it("render component with dynamic data", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const vnode = {
    tag: {
      template: "<div>{{title}}</div>",
      data() {
        return { title: "this is a component" };
      }
    },
  };
  renderer.render(vnode, container);
  expect(container.innerHTML).toBe("<div>this is a component</div>");
});
// runtime-dom
// createApp()
it("createApp of renderer", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  // Todo:
  // 1. 实现 createApp，创建 rootComponent
  // 2. 返回 mount 方法指定宿主，将 rootComponent 挂载到 宿主 container
  // 3. 实现 renderer 的单例模式
  //    用户不关心 renderer 只需从 runtime-dom 等中 import 工厂函数
  // Think：
  // 1. 为什么 Vue 需要 diff 算法，与 React 有什么不同 ？
  // 2. Vue 3 diff 范围：组件级
  //    为什么 React 不可以做到组件级，而采用了 React Fiber 链表 ？
  renderer.createApp({
    template: "<div>{{title}}</div>",
    data() {
      return {
        title: "hello, mini-vue!",
      };
    },
  }).mount(container);
  expect(container.innerHTML).toBe("<div>hello, mini-vue!</div>");
});