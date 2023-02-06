// #ok#
/*
const spliter = '#'
const format1  = str => spliter + str + spliter
const format2  = str => spliter + str + spliter
const utils = {
  format1,
  format2
}
*/
// IIFE 立即执行函数
const utils = (function() {
  const spliter = '#'
  const format1  = str => spliter + str + spliter
  const format2  = str => spliter + str + spliter
  return {
    format1,
    format2
  }
})()