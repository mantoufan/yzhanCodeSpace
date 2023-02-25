const net = require('net')
const parse = require('./parse');
const client = net.createConnection({ port: 3000 }, () => {
  // 'connect' listener.
  console.log('connected to server!')
  client.write('GET / HTTP/1.1\r\n') // 请求行：方法 + 路径 + 版本，注意：不能有空格
  client.write('HOST:127.0.0.1r\r\n') // 请求头：key:value
  client.write('\r\n') // 空行：结束 head
});
client.on('data', (data) => {
  parse(data.toString())
  client.end()
});
client.on('end', () => {
  console.log('disconnected from server')
});