const walk = require('./walk3')
const Scope = require('./scope2')
module.exports = (ast, magicString) => {
  const root = new Scope({})
  let scope = root
  let child = null


  ast.body.forEach(statement => {
    Object.defineProperties(statement, {
      _defines: {
        value: {}
      },
      _dependsOn: {
        value: {}
      }
    })
    statement._defines = Object.create(null)
    walk(statement, {
      enter(node) {
        if (node.type === 'FunctionDeclaration') {

          scope.add(node.id.name)
          if (!scope.parent()) statement._defines[node.id.name] = true

          node._scope = scope = new Scope({
            parent: scope
          })
          child = scope
          
        } else if (node.type === 'VariableDeclaration') {
          node.declarations.forEach(declaration => {
            scope.add(declaration.id.name)
            if (!scope.parent()) statement._defines[declaration.id.name] = true
          })
        } else if (node.type === 'Identifier') {
          statement._dependsOn[node.name] = true
        }
      },
      leave(node) {
        if (node.type === 'FunctionDeclaration') {
          scope = scope.parent()
        } 
      }
    })
  })
  root.child = child
  ast._scope = root
}

