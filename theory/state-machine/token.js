const { TerminalSymbol, EOFSymbol } = require("./symbol");

module.exports = (str) => {
  const regex = /(?<num>(?:[1-9]\d*|0))|(?<operator>[+\/*-])/g;
  let cur = null;
  const stack = [];
  while ((cur = regex.exec(str))) {
    stack.push(new TerminalSymbol(cur));
  }
  stack.push(new EOFSymbol());
  return stack;
};
