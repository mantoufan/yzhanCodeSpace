
const start = char => {
  if (char === '\'') {
    return AfterSingleQuote
  } else if (char === '"') {
    return AfterDoubleQuote
  } else {
    return error
  }
}

const AfterSingleQuote = char => {
  if (char === EOF) {
    return error
  } 
  const charCode = char.charCodeAt(0)
  if (charCode === 10 || charCode === 13) {
    return error
  } else if (charCode === '\\'.charCodeAt(0)) {
    return AfterSingleSlash
  } else if (charCode == '\''.charCodeAt(0)) {
    return end
  } else if (/[a-zA-Z0-9"]+/.test(char)) {
    return AfterSingleQuote
  } else {
    return error
  }
}

const AfterDoubleQuote = char => {
  if (char === EOF) {
    return error
  } 
  const charCode = char.charCodeAt(0)
  if (charCode === 10 || charCode === 13) {
    return error
  } else if (charCode === '\\'.charCodeAt(0)) {
    return AfterDoubleSlash
  } else if (/[a-zA-Z0-9']+/.test(char)) {
    return AfterDoubleQuote
  } else if (charCode == '"'.charCodeAt(0)) {
    return end
  } else {
    return error
  }
}

const AfterSingleSlash = () => {
  return AfterSingleQuote
}

const AfterDoubleSlash = () => {
  return AfterDoubleQuote
}

const end = char => {
  if (char === EOF) {
    return success
  } else {
    return error
  }
}

const error = () => {
  return error
}

const success = () => {
  return success
}

const EOF = Symbol('EOF')
const testCases = [
  [`'123'`, true],
  [`"123"`, true],
  [`"1
  23"`, false],
  [`'1
  23'`, false],
  [`"1\\"`, false],
  [`'1\\'`, false],
  [`"1\\n23"`, true],
  [`'1\\n23'`, true],
]
for (const [str, expect] of testCases) {
  const states = []
  let state = start
  for (const char of str) {
    states.push(state.name)
    state = state(char)
    states.push(state.name)
  }
  states.push(state.name)
  state = state(EOF)
  states.push(state.name)
  const res  = state === success
  console.log(expect === res ? '\x1b[32mPassed\x1b[0m' : '\x1b[31mFailed\x1b[0m', str, 'expected', expect, 'in fact', res, 'state', state.name)
}