## 换行符
<CR> \r 回车：将打字头回到行首
<LF> \n 换行：禁止

## 状态机的三个状态
1. 输入  
2. 输出  
3. 状态迁移  

## 状态机的封装思路
1. 将状态机封装成 `stream`
- write, end

2. generator
输入流，输出流

3. receive()

## Reconsume 重用，重写
```javascript 
function d_first(char) {
  return d2(char)
}
```

## 单元测试
```shell
jest
npx jest --coverage
```

