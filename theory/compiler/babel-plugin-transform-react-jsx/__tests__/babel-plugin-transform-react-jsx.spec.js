const babel = require('@babel/core')
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const babelPluginTransformReactJsxPath = path.resolve(__dirname, '../babel-plugin-transform-react-jsx.js')
const entry = path.resolve(__dirname, './src/index.jsx')
const output = path.resolve(__dirname, './dist/index.js')
const { code } =  babel.transformSync(
  fs.readFileSync(entry, 'utf-8'),
  {
    plugins: [
      [babelPluginTransformReactJsxPath, { runtime: 'automatic' }]
    ]
  }
)
fs.writeFileSync(output, code)
assert.equal(fs.readFileSync(output, 'utf-8'), `import { jsx as _jsx } from "react/jsx-runtime";
_jsx("div", {
  className: "omg_className",
  children: "text"
});`)
console.log('Passed!')