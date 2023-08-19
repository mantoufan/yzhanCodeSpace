module.exports = class HtmlParser {
  constructor() {
    let currentTagName = ''
    const start = char => {
      if (char === '<') return afterLeftBracket 
      return start
    }
    const afterLeftBracket = char => {
      if (char === ' ') return afterSpace
      if (char === '>') return afterRightBracket
      currentTagName += char
      return afterLeftBracket
    }
    const afterSpace = char => {
      
    }
    const afterRightBracket = char => {
      
    }
    this.state = start
  }
  write(char) {
    this.state = this.state(char)
  }
}