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
test('unmount', () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const vnode = {
    tag: "div",
    children: "hello",
  };
  renderer.render(vnode, container)
  expect(container.innerHTML).toBe("<div>hello</div>");
  renderer.render(null, container)
  expect(container.innerHTML).toBe("");
});
test("node's type change", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    children: "hello",
  };
  const newVnode = {
    tag: "p",
    children: "hello",
  };
  renderer.render(oldVnode, container)
  expect(container.innerHTML).toBe("<div>hello</div>");
  renderer.render(newVnode, container)
  expect(container.innerHTML).toBe("<p>hello</p>");
});
test("update text", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: Text,
    children: "hello",
  };
  const newVnode = {
    tag: Text,
    children: "olleh",
  };
  renderer.render(oldVnode, container)
  expect(container.innerHTML).toBe("hello");
  renderer.render(newVnode, container)
  expect(container.innerHTML).toBe("olleh");
});
test("update props", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    props: { id: "box", class: "box", title: "box" },
  };
  const newVnode = {
    tag: "div",
    props: { id: "box", class: "box active" },
  };
  renderer.render(oldVnode, container);
  expect(container.innerHTML).toBe(
    '<div id="box" class="box" title="box"></div>'
  );
  renderer.render(newVnode, container);
  expect(container.innerHTML).toBe('<div id="box" class="box active"></div>');
});
test("update element", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    children: "hello",
  };
  const newVnode = {
    tag: "div",
    children: "olleh",
  };
  renderer.render(oldVnode, container)
  expect(container.innerHTML).toBe("<div>hello</div>");
  renderer.render(newVnode, container)
  expect(container.innerHTML).toBe("<div>olleh</div>");
});
test("update element array chidren to text", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    children: [
      {
        tag: "span",
        children: "child",
      },
    ],
  };
  const newVnode = {
    tag: "div",
    children: "child",
  };
  renderer.render(oldVnode, container);
  expect(container.innerHTML).toBe("<div><span>child</span></div>");
  renderer.render(newVnode, container);
  expect(container.innerHTML).toBe("<div>child</div>");
});
test("update element text chidren to array", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    children: "child",
  };
  const newVnode = {
    tag: "div",
    children: [
      {
        tag: "span",
        children: "child",
      },
    ],
  };
  renderer.render(oldVnode, container);
  expect(container.innerHTML).toBe("<div>child</div>");
  renderer.render(newVnode, container);
  expect(container.innerHTML).toBe("<div><span>child</span></div>");
});
test("diff：node move", () => {
  const renderer = createRenderer(nodeOps);
  const container = document.createElement("div");
  const oldVnode = {
    tag: "div",
    children: [
      {
        tag: "p",
        children: "p1",
        key: "1",
      },
      {
        tag: "p",
        children: "p2",
        key: "2",
      },
      {
        tag: "p",
        children: "p3",
        key: "3",
      },
    ],
  };
  const newVnode = {
    tag: "div",
    children: [
      {
        tag: "p",
        children: "p3",
        key: "3",
      },
      {
        tag: "p",
        children: "p1",
        key: "1",
      },
      {
        tag: "p",
        children: "p2",
        key: "2",
      },
    ],
  };
  renderer.render(oldVnode, container);
  expect(container.innerHTML).toBe("<div><p>p1</p><p>p2</p><p>p3</p></div>");
  renderer.render(newVnode, container);
  expect(container.innerHTML).toBe("<div><p>p3</p><p>p1</p><p>p2</p></div>");
});
// runtime-dom
// createApp()
// it("createApp of renderer", () => {
//   const renderer = createRenderer(nodeOps);
//   const container = document.createElement("div");
//   // Todo:
//   // 1. 实现 createApp，创建 rootComponent
//   // 2. 返回 mount 方法指定宿主，将 rootComponent 挂载到 宿主 container
//   // 3. 实现 renderer 的单例模式
//   //    用户不关心 renderer 只需从 runtime-dom 等中 import 工厂函数
//   // Think：
//   // 1. 为什么 Vue 需要 diff 算法，与 React 有什么不同 ？
//   // 2. Vue 3 diff 范围：组件级
//   //    为什么 React 不可以做到组件级，而采用了 React Fiber 链表 ？
//   renderer.createApp({
//     template: "<div>{{title}}</div>",
//     data() {
//       return {
//         title: "hello, mini-vue!",
//       };
//     },
//   }).mount(container);
//   expect(container.innerHTML).toBe("<div>hello, mini-vue!</div>");
// });