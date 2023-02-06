const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM()
global.window = dom.window
global.document = window.document
global.navigator = window.navigator