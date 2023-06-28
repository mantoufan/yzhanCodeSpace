/* 题目 */
const a = 1
function f1() {
  const b = 2
  function f2() {
    const c = 3
  }
}
/* 期待打印结果
variable: a
function: f1
  variable: b
  function: f2
    variable: c
 */