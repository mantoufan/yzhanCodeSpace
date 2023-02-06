const Scope = require('./scope')
const walk = require('./walk')
/**
 * 分析函数
 * @param {*} ast 代码的 AST
 * @param {*} magicString 代码对应的 magicString 实例
 * @param {*} module 父节点模块
 */
function analyse (ast, magicString, module) {
  // 全局作用域
  let scope = new Scope({})

  ast.body.forEach(statement => {
    /**
     * 给作用域添加变量
     * @param {*} declaration 声明节点 
     */
    function addToScope(declaration) {
      const name = declaration.id.name
      scope.add(name)
      if (scope.parent === void 0) statement._defines[name] = true // 根节点
    }

    // statement._defines = {}
    Object.defineProperties(statement, {
      _defines: { value: {} },
      _dependsOn: { value: {} },
      _included: { value: false, writable: true },
      _source: { value: magicString.snip(statement.start, statement.end) },
    })

    walk(statement, {
      enter(node) {
        let newScope = null
        switch(node.type) {
          // 函数声明
          case 'FunctionDeclaration':
            // 加入到作用域
            addToScope(node)

            // 获取函数的参数
            const params = node.params.map(param => param.name)
            // 创建新的作用域
            newScope = new Scope({
              parent: scope,
              names: params
            })
          break;
          case 'VariableDeclaration':
            node.declarations.forEach(declarator => addToScope(declarator))
          break;
          case 'Identifier':
            // _dependsOn
            statement._dependsOn[node.name] = true
          break;
          default:
          break;
        }
        if (newScope !== null) {
          Object.defineProperties(node, {
            _scope: { value: newScope }
          })
          // 当前作用域切换到新作用域
          scope = newScope
        }
      },
      leave(node) {
        // 当前原来有作用域声明的节点
        // 离开时，要退回其父级作用域
        if (node._scope) {
          scope = scope.parent
        }
      }
    })
  })

  ast._scope = scope
}
module.exports = analyse