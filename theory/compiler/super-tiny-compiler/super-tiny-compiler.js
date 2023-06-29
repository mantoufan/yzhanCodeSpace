function tokenizer(input) {
  const tokens = []
  let current = 0
  while (current < input.length) {
    let char = input[current]
    // parenthesis
    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char
      })
      current++
    }
    // whitespace
    else if (/\s/.test(char)) {
      current++
    }
    // number
    else if (/\d/.test(char)) {
      let value = ''
      while (/\d/.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: 'number',
        value
      })
    }
    // alphabet
    else if (/[a-zA-Z]/.test(char)) {
      let value = ''
      while (/[a-zA-Z]/.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: 'name',
        value
      })
    }
  }
  return tokens
}

function parser(tokens) {
  const ast = {
    type: 'Program',
    body: []
  }
  let current = 0
  function walk() {
    let token = tokens[current]
    if (token.type === 'paren' && token.value === '(') {
      const node = {
        type: 'CallExpression',
        name: tokens[++current].value,
        params: []
      }
      token = tokens[++current]
      while (token.type !== 'paren' || token.type === 'paren' && token.value !== ')') {
        node.params.push(walk())
        token = tokens[current]
      }
      current++
      return node
    } else if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }
  }
  while (current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}

function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    for (let i = 0; i < array.length; i++) {
      traverseNode(array[i], parent)
    }
  }
  function traverseNode(node, parent) {
    const methods = visitor[node.type]
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }

    switch(node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break
      case 'CallExpression':
        traverseArray(node.params, node)
        break
      case 'NumberLiteral':
        break
      default:
        throw new TypeError(`Unknown node type: ${node.type}`)
    }
  }
  traverseNode(ast, null)
}

function transformer (ast) {
  const newAst = {
    type: 'Program',
    body: []
  }
  
  ast._context = newAst.body

  traverse(ast, {
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        }

        node._context = expression.arguments

        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression
          }
        }

        parent._context.push(expression)
      }
    },
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        })
      }
    }
  })

  return newAst
}

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n')
    case 'ExpressionStatement':
      return codeGenerator(node.expression) + ';'
    case 'CallExpression':
      return codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(', ') + ')'
    case 'NumberLiteral':
      return node.value
    case 'Identifier':
      return node.name
    default:
      throw new TypeError(`Unknown node type: ${node.type}`)
  }
}

function compiler(code) {
  const ast = parser(tokenizer(code))
  return codeGenerator(transformer(ast))
}

module.exports = {
  tokenizer,
  parser,
  transformer,
  codeGenerator,
  compiler
}