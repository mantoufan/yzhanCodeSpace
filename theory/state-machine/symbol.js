class TerminalSymbol {
  constructor(o) {
    if (o.groups.num) {
      this.type = "Number";
      this.value = o.groups.num;
    } else {
      this.value = this.type = o.groups.operator;
    }
  }
}
class NonTerminalSymbol {
  constructor(type, children) {
    this.type = type;
    this.children = children;
  }
}

class EOFSymbol {
  constructor() {
    this.type = "EOF";
  }
}

module.exports = {
  TerminalSymbol,
  NonTerminalSymbol,
  EOFSymbol,
};
