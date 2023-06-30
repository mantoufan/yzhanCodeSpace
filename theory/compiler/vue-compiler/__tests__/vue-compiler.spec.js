const assert = require('assert')
const path = require('path')
const fs = require('fs')
const entry = path.resolve(__dirname, './src/index.vue')
const output = path.resolve(__dirname, './dist/index.js')
const { compile } = require('../vue-compiler')
compile(entry, output)
assert.equal(fs.readFileSync(output, 'utf-8'), `const _Vue = Vue

return function render(_ctx, _cache) {
  with (_ctx) {
    const { toDisplayString: _toDisplayString, createElementVNode: _createElementVNode, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock } = _Vue

    return (_openBlock(), _createElementBlock(_Fragment, null, [
      _createElementVNode("template", null, [
        _createElementVNode("p", null, _toDisplayString(greeting) + " World!", 1 /* TEXT */)
      ]),
      _createElementVNode("script", null, " export default { data() { return { greeting: 'Hello' } } } "),
      _createElementVNode("style", { scoped: "" }, " p { font-size: 2em; text-align: center; } ")
    ], 64 /* STABLE_FRAGMENT */))
  }
}`)
console.log('Passed!')