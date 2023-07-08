```js
#!/usr/bin/env node 
```
在 env 环境里可执行文件  
node 可以换成 node 路径  
任何脚本都可以，不一定只是 javascript  
文件系统中设置成可执行  
-rw-rw-r-- 332 权限都有 777    
-rwxrwxr-- 774  
统一环境，可以使用：docker  
可执行文件：标准输入和标准输出  
& 不会阻塞执行，保留输出

ps aux 显示进程详细信息
kill -9 PID 给进程信号量
ps aux | grep ./run 使用管道过滤结果
## 参数
node 路径, 脚本所在路径 dirname，参数 按半角空格分组  
如果参数有空格，用双引号包裹
## 结束状态码
exit(0) : 正常结束
exit(1) ：Faild 异常结束
## | grep
`|` 把上一个进程的输出当作下一个进程的输入
`|` 两个进程间通讯，连接输入输出，使用 `pipe`
`grep` 对输出进行过滤  
## 输入输出
`>`输出，后跟文件路径  
`<`输入，后跟文件路径  
## 进程本质特性：隔离
1. 内存地址空间独立，变量相互间无法访问  
2. 是操作系统内存管理的手段  
3. Windows 下，单进程**内存空间**锁定 4GB，多退少补 
## 子进程
/* childProcess.stdout 对自己写，子进程的 stdout 对于主进程是读
childProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
}); */
/* const process = require('node:process')
process.stdout.write('Sign: Start')
process.stdin.pipe(process.stdout) */
/* 出错的时候写，exit 非 0 状态码 */
childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

## 多进程
`fork` 会把当前进程复制一份  
检查当前进程是否是主进程，如果是就复制一份
```javascript 
if (cluster.isPrimary) {
  cluster.fork()
}
```
Pipe 调用了 `on` 和 `end` 方法  
触发了三个事件：
1. `unpipe`
2. `close`
3. `finish`