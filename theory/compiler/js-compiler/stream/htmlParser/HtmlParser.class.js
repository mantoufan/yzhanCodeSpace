const { Stream } = require("node:stream")
class Token {
  constructor(type, content) {
    this.type = type
    this.content = content
    this.attributes = Object.create(null)
  }
  setType(type) {
    this.type = type
  }
  getType() {
    return this.type
  }
  setContent(content) {
    this.content = content
  }
  getContent() {
    return this.content
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  getAttribute(name) {
    return this.attributes[name]
  }
  getLog() {
    const { type, content, attributes } = this
    return JSON.stringify(Object.keys(attributes).length === 0 ? {
      type,
      content
    } : {
      type,
      content,
      attributes
    })
  }
}
module.exports = class HtmlParser extends Stream {
  constructor() {
    super()
    let currentToken = null
    let currentAttribueName = ''
    let currentAttribueValue = ''
    let currentTagName = ''

    const emit = token => {
      // this.emit('data', token.getLog() + '\n')
      console.log(token.getLog())
    }

    const dataState = char => {
      if (char === '&') return dataState
      if (char === '<') {
        currentToken = new Token()
        currentToken.setType('openTag')
        return tagOpen 
      }
      emit(new Token('char', char))
      return dataState
    }

    const tagOpen = char => {
      currentTagName = ''
      if (char === ' ') return tagOpen
      if (char === '/') return endTag
      return tagName(char)
    }

    const tagName = char => {
      if (char === ' ') return beforeAttribute
      if (char === '/') return selfClosingStartTag
      if (char === '>') {
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      currentTagName += char
      return tagName 
    }

    const beforeAttribute = char => {
      if (char === ' ') return beforeAttribute
      if (char === '/') return selfClosingStartTag
      if (char === '>') return dataState
      currentAttribueName = ''
      return attributeName(char)
    }

    const attributeName = char => {
      if (char === '=') return beforeAttributeValue
      if (char === '\t' || char === '\n' || char === ' ') return afterAttributeName(char)
      currentAttribueName += char
      return attributeName
    }

    const afterAttributeName = char => {
      if (char === '/') return selfClosingStartTag
      if (char === '=') return beforeAttributeValue
      if (char === '>') return dataState
      return attributeName(char)
    }

    const beforeAttributeValue = char => {
      currentAttribueValue = ''
      if (char === '"') return attributeValueDouble
      if (char === `'`) return attributeValueSingle
      if (char === '>') return dataState
      return attributeValueUnquoted(char)
    }

    const attributeValueDouble = char => {
      if (char === '"') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return afterAttributeValueQuoted
      }
      if (char === '&') return attributeValueDouble
      currentAttribueValue += char
      return attributeValueDouble
    }

    const attributeValueSingle = char => {
      if (char === `'`) {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return afterAttributeValueQuoted
      }
      if (char === '&') return attributeValueSingle
      currentAttribueValue += char
      return attributeValueSingle
    }

    const attributeValueUnquoted = char => {
      if (char === ' ' || char === '\t') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return beforeAttribute
      }
      if (char === '&') return attributeValueUnquoted
      if (char === '>') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState 
      }
      currentAttribueValue += char
      return attributeValueUnquoted
    }

    const afterAttributeValueQuoted = char => {
      if (char === ' ' || char === '\t') return beforeAttribute
      if (char === '/') return selfClosingStartTag
      if (char === '>') {
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      return beforeAttribute(char)
    }

    const selfClosingStartTag = char => {
      if (char === '>') {
        currentToken.setType('selfClosingTag')
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      return beforeAttribute(char)
    }
    
    const endTag = char => {
      if (char === '>') {
        return dataState
      }
      currentToken.setType('closeTag')
      return tagName(char)
    }

    this.state = dataState
  }
  write(char) {
    this.state = this.state(char)
  }
}