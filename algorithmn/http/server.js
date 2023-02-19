const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-type': 'text/html'})
  res.end(`<h1>Hello world</h1>`)
})
server.listen(3000)

