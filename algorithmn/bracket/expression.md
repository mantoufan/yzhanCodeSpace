# 乘除
<Mutiplicative> := <Number> | <Number> "*" <Mutiplicative> | <Number> "/" <Mutiplicative>

# 加减
<Additive> := <Mutiplicative> | <Mutiplicative> "+" <Additive> | <Mutiplicative> "-" <Additive>

# 括号
<Primary> := "(" <Additive> ")" | <Primary>

# 都要加括号
## 乘除
<Mutiplicative> := <Number> | "(" <Number> "*" <Mutiplicative> ")" | "(" <Number> "/" <Mutiplicative> ")"

## 加减
<Additive> := <Mutiplicative> | "(" <Mutiplicative> "+" <Additive> ")" | "(" <Mutiplicative> "-" <Additive> ")"

# ASI
auto semi insertion
1. \n\r
2. }
3. EOF

当前 symbol 不被当前状态接受，当 symbol 前有回车，插入 ;