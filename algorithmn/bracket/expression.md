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