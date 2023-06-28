const path = require('path')
const rollup = require('../lib/ast/rollup')
const entry = path.resolve(__dirname, './01/main.js')
console.log(entry);
rollup(entry, './01/bundle.js')