const http = require('node:http')
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    data: 'hello world',
  }))
})

server.listen(8000)