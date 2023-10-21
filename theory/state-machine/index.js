const getTokens = require("./token");
const { NonTerminalSymbol } = require("./symbol");
const { EOFSymbol } = require("./symbol");
const startState = {
  AdditiveExpression: {
    EOF: {
      $end: true,
    },
    "+": {
      MultiplicativeExpression: {
        $reduce: "AdditiveExpression",
      },
    },
    "-": {
      MultiplicativeExpression: {
        $reduce: "AdditiveExpression",
      },
    },
  },
  MultiplicativeExpression: {
    $reduce: "AdditiveExpression",
    "*": {
      PrimaryExpression: {
        $reduce: "MultiplicativeExpression",
      },
    },
  },
  PrimaryExpression: {
    $reduce: "MultiplicativeExpression",
  },
  "(": {
    AdditiveExpression: {
      ")": {
        $reduce: "PrimaryExpression",
      },
    },
  },
  Number: {
    $reduce: "PrimaryExpression",
  },
};

// Production Rules 产生式规则
const productionRules = [
  [
    "AdditiveExpression",
    [
      ["MultiplicativeExpression"],
      ["AdditiveExpression", "+", "MultiplicativeExpression"],
      ["AdditiveExpression", "-", "MultiplicativeExpression"],
    ],
  ],
  [
    "MultiplicativeExpression",
    [
      ["PrimaryExpression"],
      ["MultiplicativeExpression", "*", "PrimaryExpression"],
    ],
  ],
  [
    "MultiplicativeExpression",
    [
      ["PrimaryExpression"],
      ["MultiplicativeExpression", "*", "PrimaryExpression"],
    ],
  ],
  ["PrimaryExpression", [["(", "AdditiveExpression", ")"], ["Number"]]],
];

// Using Map to store Rules 将产生式规则存储到 Map
const ruleMap = new Map(productionRules);

// 初始状态
const initialStart = {
  AdditiveExpression: {
    EOF: { $end: true },
  },
};

// Clousure
const dictionary = new Map();
const run = (state, ruleMap) => {
  const hashCode = JSON.stringify(state);
  if (dictionary.has(hashCode)) return dictionary.get(hashCode);
  dictionary.set(hashCode, state);

  const visited = new Set();
  const queue = [...Object.keys(state)];
  while (queue.length !== 0) {
    const symbol = queue.shift();
    if (visited.has(symbol)) continue;
    visited.add(symbol);
    const current = ruleMap.get(symbol);
    if (current === void 0) continue;
    for (const ruleBody of current) {
      let prev = state;
      queue.push(ruleBody[0]);
      for (const part of ruleBody) {
        if (prev[part] === void 0) prev[part] = Object.create(null);
        prev = prev[part];
      }
      prev.$reduce = symbol;
      prev.$count = ruleBody.length;
    }
  }

  for (const key of Object.keys(state)) {
    if (key.startsWith("$")) continue;
    const result = run(state[key], ruleMap);
    state[key] = result;
  }
  return state;
};
const states = run(initialStart, ruleMap);

const expression = "1+2";
const tokens = getTokens(expression);
const stack = [];
const stateStack = [states];
let state = states;

const shift = (symbol) => {
  console.log(symbol.type);
  if (state[symbol.type]) {
    state = state[symbol.type];
    stateStack.push(state);
    stack.push(symbol);
  } else {
    if (state.$reduce) {
      let count = state.$count;
      const children = [];
      while (count--) {
        children.unshift(stack.pop());
        stateStack.pop();
      }
      const nonTerminalSymbol = new NonTerminalSymbol(state.$reduce, children);
      state = stateStack[stateStack.length - 1];
      stateStack.push(state);
      shift(nonTerminalSymbol);
    } else if (symbol.type !== "EOF") {
      throw new Error("Uncaught Syntax Error: Unexpected " + symbol.type);
    }
  }
};

for (const symbol of tokens) {
  shift(symbol);
}
shift(new EOFSymbol());

console.log(stack);
