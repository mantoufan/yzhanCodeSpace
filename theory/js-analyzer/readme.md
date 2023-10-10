// IP 地址
<one> ::= '0'...'9'
<three> ::= <one><one><one>
<host> ::= <three>.<three>.<three>
<express> :: = <0-9> | <1-9><0-9> | <1><0-9><0-9> | <2><0-4><0-9> | <2><5><0-5>

// 四则运算
<one> ::= "0" | "1" | ... | "9"
<more> ::= "1" | ... | "9" | <more><one>
<num> ::= <one> | <more>

<operator> = +|-|*|/|()
<token> = <num> | <operator>
<expression> = <token> | <expression><token>

// 四则运算
<PrimaryExpression> = <num> | ( <num> )
<MultiplicativeExpression> = <PrimaryExpression> | <MultiplicativeExpression> * <PrimaryExpression>
<AdditiveExpression> = <MultiplicationExpression> | <AdditiveExpression> + <MultiplicativeExpression>

// 正则
const numRegex = /^[0-9]|([1-9]\d+)|[+\-*\/()]$/g

const regEX = /[0-9]/
