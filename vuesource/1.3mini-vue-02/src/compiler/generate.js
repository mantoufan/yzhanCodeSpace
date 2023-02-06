// 只需要生成 render 函数的 return 部分
// this._c('div', {}, 'xxx')
// this._c('div', null, [...])
export function generate(ast) {
  // 递归 ast
  const code = genNode(ast[0])
  return `return ${code}`
}

function genNode(ast) {
  // 根据节点类型，执行不同的生成逻辑
  // genElement 中的文本和插值处理： Element 中的纯文本，直接拍平成字符串，放入 param3
  // 这里下方的文本和插值处理：children 中的纯文本，返回 this._v，放入 param3 的 [] 之间
  switch(ast.type) {
    case 'Element':
      return genElement(ast)
    case 'Text':
      return genText(ast) // 字符串，加引号
    case 'Interpolation':
      return genText(ast.content) // 插值，表达式，不加引号
  }
  return ''
}

// this._c('div', {}, 'xxx')
function genElement(ast) {
  // 获取标签名称
  const tagName = ast.tag
  // 获取属性
  const props = genProps(ast)
  // 递归子元素
  const children = genChildren(ast)
  return `this._c('${tagName}',${props ? props : 'null'}${children ? `,${children}` : ''})`
}

// todo
function genProps(ast) {
  return null
}

function genChildren(ast) {
  // 获取 children
  // 看看 children 类型
  // 1. 如果只有一个 Text 类型的子元素，希望生成字符串
  // _c('div', null, 'xxx')
  // 2. 其他情况生成数组
  // _c('div', null, [_c(...)])
  if (ast.children.length === 0) return null
  if (ast.children.length === 1) {
    const node = ast.children[0]
    if (node.type === 'Text') return `'${node.content}'`
    else if (node.type === 'Interpolation') return `this.${node.content.content}`
  } else {
    return `[${ast.children.map(node => genNode(node)).join(',')}]`
  }
}

function genText(ast) {
  // 1. 表达式生成
  // 2. 纯文本
  let content = ''
  if (ast.type === 'Expression') {
    content = `this.${ast.content}`
  } else if (ast.type === 'Text') {
    content = `'${ast.content}'`
  }
  return `this._v(${content})`
}