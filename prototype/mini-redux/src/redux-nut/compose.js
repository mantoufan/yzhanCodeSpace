const compose = (...funcs) => {
  return (...args) => funcs.reduce((a, b) => b(a(...args)))
}
export default compose