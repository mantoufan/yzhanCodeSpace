module.exports = (ast, { enter = () => {}, leave = () => {} }) => {
  (function d (node)  {
    if (node === null || typeof node !== 'object') return
    enter(node)
    const keys = Object.keys(node)
    for (const key of keys) {
      d(node[key])
    }
    leave(node)
  })(ast)
}