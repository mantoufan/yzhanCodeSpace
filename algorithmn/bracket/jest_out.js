  console.log
    [
      {
        "ruleBody": [
          "NewExpression"
        ],
        "$reduce": "Expression"
      },
      {
        "ruleBody": [
          "MemberExpression"
        ],
        "$reduce": "NewExpression"
      },
      {
        "ruleBody": [
          "new",
          "NewExpression"
        ],
        "$reduce": "NewExpression"
      },
      {
        "ruleBody": [
          "Primary"
        ],
        "$reduce": "MemberExpression"
      },
      {
        "ruleBody": [
          "MemberExpression",
          ".",
          "Identifier"
        ],
        "$reduce": "MemberExpression"
      },
      {
        "ruleBody": [
          "MemberExpression",
          "[",
          "Expression",
          "]"
        ],
        "$reduce": "MemberExpression"
      },
      {
        "ruleBody": [
          "Literal"
        ],
        "$reduce": "Primary"
      },
      {
        "ruleBody": [
          "Identifier"
        ],
        "$reduce": "Primary"
      },
      {
        "ruleBody": [
          "(",
          "Expression",
          ")"
        ],
        "$reduce": "Primary"
      },
      {
        "ruleBody": [
          "NumberLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "ruleBody": [
          "StringLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "ruleBody": [
          "BooleanLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "ruleBody": [
          "NullLiteral"
        ],
        "$reduce": "Literal"
      }
    ]
