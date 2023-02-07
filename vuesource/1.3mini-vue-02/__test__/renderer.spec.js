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