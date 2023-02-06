function walk(ast, {enter, leave}) { // enter 和 leave 是两个回调函数
  visit(ast, ast, enter, leave)
}
function visit(node, parent, enter, leave) {
  if (node === null) return
  if (enter) enter.call(null, node, parent)
  // 对象遍历
  const children = Object.keys(node).filter(key => typeof node[key] === 'object')

  children.forEach(childKey => visit(node[childKey], node, enter, leave))

  if (leave) leave.call(null, node, parent)
}
module.exports = walk