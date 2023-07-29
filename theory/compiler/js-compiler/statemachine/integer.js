// check if a integer is 10 digits 
// 0 - . / 

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
  } else if (charCode >= '1'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
    // return new state
    return after1To9
  } else {
    // non-number
    return error
  }
}

// after zero state
function afterZero() {
  return error
}

// after 1 to 9 state
//  多个 0 
function after1To9(char) {
  const charCode = char.charCodeAt(0)
  if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
    // return new state
    return after1To9
  }
  return error
}

// error state
function error() {
  return error
}

const str = '0'
const EOF = Symbol('EOF')

let state = start
for (const char of str) {
  state = state(char)
}
state = state(EOF)
console.log(state.name)