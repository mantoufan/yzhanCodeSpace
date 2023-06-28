class Scope {
  constructor(options) {
    this.parent = options.parent
    this.names = options.names || []
  }
  /**
   * 变量名字
   * @param {*} name
   */
  add(name) {
    this.names.push(name)
  }
  /**
   * 判断变量是否被声明
   * @param {*} name 
   * @return 是否被声明
   */
  contains(name) {
    return !!this.findDefiningScope(name)
  }
  /**
   * 查找变量所在作用域
   * @param {*} name 
   * @return 变量所在作用域
   */
  findDefiningScope(name) {
    let node = this, b = false
    while ((b = node.names.includes(name)) == false) node = this.parent
    return  b === true ? node : null
  }
}
module.exports = Scope