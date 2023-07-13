# Enviroment
1. JS
2. Node.js
# JS Binary
1. TypedArray
- Int8Array
- Uint8Array
- Uint8ClapedArray
- Int32Array
- BigInt64Array
- BigUint64Array

2. Number -> Float64Array
3. Visit memory de basic unit ：Byte 字节
8 Bit -> 1 Byte
## Q.A: 1 Byte could express how many numbers:
2 ** 8  
int8: -128 ~ 127  
## uint8(usigned int8): 0 ~ 255
Could use uint8Array to replace byte  
## IEEE754
第 1 位 符号位 sign bits
中 11 位 指数位 exponent bits
后 52 位 精度位 mantissa bits
Byte TypedArray 可以在共享内存的情况下，请将它们解读成不同的数据类型

# Node.js Binary
Node.js buffer is designed far before the JS  
## How to transform Node.js Buffer to JavaScript Buffer
We cloud use 2 two 16 进制 bit to express one byte  
It is traditional way using `<Buffer 00 00 00 00 00>`  
## Stream
Buff is a basic foundation for stream.  

# String
- ASCII 0 - 127 alpabet control sign and comma etc.
- Unicode
  - home.unicode.org 4 个 16 hex bit is full <Buffer 00 00>
- UCS
  - It is competitive with Unicode, 4 个 16 hex Bit is most, 2 ** 16

CountrySide Standards:
- GB
  - GB2312
  - GBK(GB13000)
  - GB18030
- ISO-8859
- BIG5


## Strig - Encodeing
String -> Number -> byte  

UTF8: 1 alpha - 1 bit
High bit is for controling: [1110 ] [10] [10] When the string is exceeds the max 2 bits  
UTF16: 1 alpha - 2 bit [110110] []  [110111] [] When the string is exceeds the max 2 bits