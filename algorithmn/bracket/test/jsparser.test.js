const { parse, parseStr,  parseExpression, evaluate } = require('../jsparser')

describe('Test LR Parser', () => {
  
  test('let a = null + 1 + "str"', () => {
    expect(JSON.stringify(parse('let a = null + 1 + "str"'))).toEqual(JSON.stringify([{"type": "let", "value": "let"}, {"type": "Identifier", "value": "a"}, {"type": "=", "value": "="}, {"type": "NulLiteral", "value": "null"}, {"type": "+", "value": "+"}, {"type": "NumberLiteral", "value": "1"}, {"type": "+", "value": "+"}, {"type": "StringLiteral", "value": "\"str\""}, {"type": "EOF"}]))
  })
})

describe('ExpressionParse', () => {
  it('literal', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]]
    ])
    const initialState = {
      Literal: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("'fanfan'"), map, initialState)
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"Literal","children":[{"type":"StringLiteral","value":"'fanfan'"}]},{"type":"EOF"}]))
  })

  it('Primary', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]]
    ])
    const initialState = {
      Primary: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("'fanfan'"), map, initialState)
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"Primary","children":[{"type":"Literal","children":[{"type":"StringLiteral","value":"'fanfan'"}]}]},{"type":"EOF"}]))
  })
  it('MemberExpression', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
    ])
    const initialState = {
      MemberExpression: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("a.b"), map, initialState)
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"MemberExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Identifier","value":"a"}]}]},{"type":".","value":"."},{"type":"Identifier","value":"b"}]},{"type":"EOF"}]))
  })
  it('AdditiveExpression', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['MultiplicativeExpression', [['MemberExpression'], ['MultiplicativeExpression', '*', 'MemberExpression'], ['MultiplicativeExpression', '/', 'MemberExpression'], ['MultiplicativeExpression', '%', 'MemberExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
    ])
    const initialState = {
      AdditiveExpression: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("a.b + 2 * 3"), map, initialState)
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"AdditiveExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"MemberExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Identifier","value":"a"}]}]},{"type":".","value":"."},{"type":"Identifier","value":"b"}]}]}]},{"type":"+","value":"+"},{"type":"MultiplicativeExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"2"}]}]}]}]},{"type":"*","value":"*"},{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"3"}]}]}]}]}]},{"type":"EOF"}]))
  })
  it('AssignmentExpression', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['LeftHandSideExpression', [['MemberExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]]
    ])
    const initialState = {
      AssignmentExpression: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("a = 20"), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"AssignmentExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Identifier","value":"a"}]}]}]},{"type":"=","value":"="},{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"20"}]}]}]}]}]}]}]}]},{"type":"EOF"}]))
  })
  it('Statement', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['LeftHandSideExpression', [['MemberExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      // ['IfStatement', [
      //   ['if', '(', 'Expression', ')', 'Statement'], 
      //   ['if', '(', 'Expression', ')', 'else', 'Statement']
      // ]],
      // ['forStatement', [
      //   ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
      // ]],
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
    ])
    const initialState = {
      Statement: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("let a = 1;"), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"let","value":"let"},{"type":"Identifier","value":"a"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]},{"type":"EOF"}]))
  })
  it('Test StatementList', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['LeftHandSideExpression', [['MemberExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]]
    ])
    const initialState = {
      StatementList: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr(`
    let a = 1;
    const b = 1;
    `), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"StatementList","children":[{"type":"StatementList","children":[{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"let","value":"let"},{"type":"Identifier","value":"a"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"const","value":"const"},{"type":"Identifier","value":"b"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"EOF"}]))
  })

  it('ASI followed EOF and }', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['LeftHandSideExpression', [['MemberExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]]
    ])
    const initialState = {
      StatementList: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr('let a = 1 + 2 + 3'), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"StatementList","children":[{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"let","value":"let"},{"type":"Identifier","value":"a"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"AdditiveExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]},{"type":"+","value":"+"},{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"2"}]}]}]}]}]}]},{"type":"+","value":"+"},{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"3"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"EOF"}]))
  })

  it('ASI followed Enter', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['LeftHandSideExpression', [['MemberExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]]
    ])
    const initialState = {
      StatementList: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("let a = 1 + 2 + 3\nlet b = 1"), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"StatementList","children":[{"type":"StatementList","children":[{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"let","value":"let"},{"type":"Identifier","value":"a"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"AdditiveExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]},{"type":"+","value":"+"},{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"2"}]}]}]}]}]}]},{"type":"+","value":"+"},{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"3"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"Declaration","children":[{"type":"let","value":"let"},{"type":"Identifier","value":"b"},{"type":"=","value":"="},{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Literal","children":[{"type":"NumberLiteral","value":"1"}]}]}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"EOF"}]))
  })

  it('New Expression / Call Expression', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MmberEXpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]]
    ])
    const initialState = {
      StatementList: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("new Class1()"), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"StatementList","children":[{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"ExpressionStatement","children":[{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"CallExpression","children":[{"type":"new","value":"new"},{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Identifier","value":"Class1"}]}]},{"type":"(","value":"("},{"type":")","value":")"}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"EOF"}]))
  })
  it('Function Declaration', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MmberEXpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      /** Added: Start */
      ['FunctionDeclaration', [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
        ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
      ]],
      ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
      /** Added: End */
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
      /** Added */
      ['Program', [['StatementList']]]
    ])
    const initialState = {
      StatementList: {
        EOF: {
          $end: true
        }
      }
    }
    const expression = parseExpression(parseStr("new Class1()"), map, initialState)
    // console.log(JSON.stringify(expression))
    expect(JSON.stringify(expression)).toBe(JSON.stringify([{"type":"StatementList","children":[{"type":"StatementListItem","children":[{"type":"Statement","children":[{"type":"ExpressionStatement","children":[{"type":"Expression","children":[{"type":"AssignmentExpression","children":[{"type":"AdditiveExpression","children":[{"type":"MultiplicativeExpression","children":[{"type":"LeftHandSideExpression","children":[{"type":"CallExpression","children":[{"type":"new","value":"new"},{"type":"MemberExpression","children":[{"type":"Primary","children":[{"type":"Identifier","value":"Class1"}]}]},{"type":"(","value":"("},{"type":")","value":")"}]}]}]}]}]}]},{"type":";","value":";"}]}]}]}]},{"type":"EOF"}]))
  })
  describe('Test evaluator', () => {
    const map = new Map([
      ['Literal', [['NumberLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MmberEXpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '/', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      /** Added: Start */
      ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
      ['FunctionDeclaration', [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
        ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
      ]],
      /** Added: End */
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
      /** Added */
      ['Program', [['StatementList']]]
    ])
    const initialState = {
      Program: {
        EOF: {
          $end: true
        }
      }
    }
    it('1 + 1', () => {
      const expression = parseExpression(parseStr("1 + 1"), map, initialState)
      console.log(evaluate(expression[0]))
    })
  })
})