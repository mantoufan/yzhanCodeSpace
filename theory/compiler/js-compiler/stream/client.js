const net = require('node:net')
const client = net.createConnection({ port: 8000 }, () => {
  console.log('connected')
  client.write("POST / HTTP/1.1\r\nHost: 127.0.0.1\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nfield1=aaa&code=x%3D1")
})

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})

client.on('end', () => {
  console.log('disconnected from server')
})
