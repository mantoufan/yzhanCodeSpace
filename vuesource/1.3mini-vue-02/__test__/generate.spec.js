import { generate } from "../src/compiler/generate";

it("generate element with text", () => {
  const ast = [
    {
      type: "Element",
      tag: "div",
      props: [],
      isUnary: false,
      children: [{ type: "Text", content: "foo" }],
    },
  ];
  const code = generate(ast);
  // _c 是 createElement 虚拟 dom, param2 是属性，现在只有元素
  // param3 是 children，只有一个元素时，参数 3 是字符串，有多个子元素， param3 就是一个数组
  expect(code).toMatch(`return this._c('div',null,'foo')`);
});
it("generate element with expression", () => {
  const ast = [
    {
      type: "Element",
      tag: "div",
      props: [],
      isUnary: false,
      children: [
        {
          type: "Interpolation",
          content: { type: "Expression", content: "foo" },
        },
      ],
    },
  ];
  const code = generate(ast);
  expect(code).toMatch(`return this._c('div',null,this.foo)`);
});
it("generate element with muti children", () => {
  const ast = [
    {
      type: "Element",
      tag: "div",
      props: [],
      isUnary: false,
      children: [
        { type: "Text", content: "foo" },
        {
          type: "Element",
          tag: "span",
          props: [],
          isUnary: false,
          children: [{ type: "Text", content: "bar" }],
        },
      ],
    },
  ];
  const code = generate(ast);
  expect(code).toMatch(
    `return this._c('div',null,[this._v('foo'),this._c('span',null,'bar')])`
  );
});