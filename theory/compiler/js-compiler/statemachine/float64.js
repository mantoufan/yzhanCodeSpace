// check if a integer is 10 digits 
// 0 - . / 

const { after } = require("node:test")

// initial state
/* char:
1. 0
2. 1 - 9
*/

function start(char) {
  const charCode = char.charCodeAt(0)
  if (charCode === '0'.charCodeAt(0)) {
    // return new state
    return afterZero
  } else if (charCode === '.'.charCodeAt(0)) { 
    return afterDot
  } else if (charCode >= '1'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
    // return new state
    return after1To9
  } else {
    // non-number
    return error
  }
}

// after zero state
function afterZero(char) {
  if (char === EOF) { // 0;
    return success
  } else if (char.charCodeAt(0) === '.'.charCodeAt(0)) { // 0.
    return after0Dot
  } else { // illegal: 00 01 0a 
    return error
  }
}

// after 0 dot
function after0Dot(char) {
  if (char === EOF) {
    return success
  } else if (char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0)) {
    return after0Dot
  } else { // 0.. || 0.a 0._
    return error
  }
}

// after dot state
function afterDot(char) { // . [0-9]
  if (char === EOF) {
    return error
  } else if (char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0)) {
    return after0Dot
  } else {
    return error
  }
}

// after 1 to 9 state
//  多个 0 
function after1To9(char) {
  const charCode = char.charCodeAt(0)
  if (char === EOF) { // 0 123 2340
    return success
  } else if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
    // return new state
    return after1To9
  } else if (charCode === '.'.charCodeAt(0)) { // 554345.0-9 EOF a.b
    return after0Dot
  } else {
    return error
  }
}

// error state
function error() {
  return error
}

// success state
function success() {
  return error
}

const str = '11.11'
const EOF = Symbol('EOF')

let state = start
for (const char of str) {
  console.log(state.name)
  state = state(char)
}
console.log(state.name)
state = state(EOF)
console.log(state.name)