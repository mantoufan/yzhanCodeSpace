import { generate, setCurrentOptions } from "../src/compiler/generate";

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
it("generate element with multi children", () => {
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
// <input type="text" v-model="title" @click="clear"></input>
it("generate element with props", () => {
  const ast = [{
    tag: "input",
    type: "Element",
    props: [
      {
        type: "Attribute",
        name: "type",
        value: "text",
      },
      {
        type: "Directive",
        name: "v-model",
        value: "title",
      },
      {
        type: "Event",
        name: "click",
        value: "clear",
      },
    ],
    children: [],
    isUnary: false,
  }]
  const options = {
    data() {
      return {
        title: 0
      }
    },
    methods: {
      clear(){
        title = ''
      }
    }
	}
  setCurrentOptions(options) // pass function clear() to generator
  const code = generate(ast)
  // <input type="text" v-model="title" @click="clear"></input>
  /* {
    attrs: { type: 'text' },
    directions: [ { name: 'v-model', value: '(title)', expression: 'title' } ],
    on: {
      click: "function () {\n        title = '';\n      }"
    }
  }*/
  expect(code).toMatch(
    `return this._c('input',`+
    `{'attrs':{'type':'text'},`+
     `'directions':[`+
                    `{'name':'v-model','value':'(title)','expression':'title'}`+
                  '],'+
     `'on':{'click':'function () {\\n        title = '';\\n      }'}})`
  )
})