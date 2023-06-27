const http = require('node:http')
const fs = require('node:fs')

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  fs.createReadStream('./data.json', { encoding: 'utf8' }).pipe(res).on('end', () => {
    res.end()
  })
})

// Start the server
server.listen(8080)