const HtmlParser = require('../HtmlParser.class')

describe('Test HTML Parser', () => {
  it('Write HTML', () => {
    const htmlParser = new HtmlParser()
    const html = '<h1 class="text" id=a>Hello World</h1><img id="b"/>'
    for (let i = 0; i < html.length; i++) {
      htmlParser.write(html[i])
    }
  })
})