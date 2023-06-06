module.exports = class {
  #parent
  #variables 
  constructor({ parent = null }) {
    this.#parent = parent
    this.#variables = new Set
  }
  add(variable) {
    this.#variables.add(variable)
  }
  has(variable) {
    return this.#variables.has(variable)
  }
  findDefiningScope(variable) {
    let cur = this
    while (cur !== null) {
      if (cur.has(variable)) return cur
      cur = cur.#parent
    }
    return null
  }
  cantains(variable) {
    return !!this.findDefiningScope(variable)
  }
  parent() {
    return this.#parent
  }
}