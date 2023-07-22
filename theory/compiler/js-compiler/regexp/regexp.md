## 乔姆斯基
他将语言分为四种类型
### 语言类型及对应的产生式特点
1 - 4 约束从强到弱
1. 正则语言  
- Example: 正则
- Sign: 产生式只能左递归，或右递归，无法生成嵌套结构，只能生成列表结构  
2. 上下文无关语言  
- Example: 计算机语言（主体上下文无关）  
- Sign：产生式左边只有一个非终结符  
3. 上下文相关语言  
- Example: 语言，自然语言  
- Sign：产生式左边有 > 1 个非终结符
  - <a> <alien-language> <b> ::= <a> (原产生式) <b>
  - <a>: 上文
  - <b>: 下文
4. 自由语言   
- 完全自由
- 左右任意字符

### 正则表达式  
处理正则语言的通用方案  
[] - 可以设置范围，是 Code Point 的范围
#### Unicode Code Point 码点
##### 定义
字符：数字表示一个字符。ASCII 码 0 ~ 127，共 128 个字符  
    （计算机语言中的定义）  
字形：字符 + 字体（看到的）  
字符对应的数字，被叫做 ASCII 码  
Unicode: 万国码，统一码，没有特别官方的翻译，独立标准化组织定义  
         Emoji，字符数仍在不断增加 
[\u编码] 来表示一个字符 
##### 码点
字符编码，可以用 16 进制或十进制表示  
a - 97 z - 122  
UCS 2.0 与 Unicode 表示一致   
GB  
- GB2312 国标  
- GBK（GB130000） 在 GB2312 增补了字符  
- GB18030 能见到的汉字都加到了里面，字符编码与 Unicode 并不一致  
ISO-8859  
BIG5  台湾，繁体中文，标准

// exec
// 可以把多个匹配，一个个匹配出来

## JavaScript 基本语法单元
Literal 字面量  
- Literally 会比 Literal 用得多  
StringLiteral 字符串字面量

### 关键字
// function try catch finally let const var
// break continue static switch case async await
// this class extends for super yield with
// return typeof instantof do while in delete enum
// throw debugger void true false if else import export
### Punctuators （符号）
运算符 operator
一元运算符
二元运算符
+ - * / % > <
位运算符
^ ~ & |
逻辑运算符
! || &&
赋值运算符
&&= &= ||= |=
比较运算符
>= <= == === != !==
非运算符
~
Identifier
_ or $ [A-Z][a-z] 开头